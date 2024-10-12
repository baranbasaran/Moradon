package com.baranbasaran.cheaperbook.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Base64;
import java.util.Date;

@Component
public class JwtTokenUtil {

    private final Key SECRET_KEY;
    private final long jwtExpirationMs;

    public JwtTokenUtil(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.expirationMs}") long jwtExpirationMs
    ) {
        this.jwtExpirationMs = jwtExpirationMs;

        try {
            byte[] decodedKey = Base64.getDecoder().decode(secret);
            if (decodedKey.length < 64) { // HS512 requires at least 512 bits (64 bytes)
                throw new IllegalArgumentException("The secret key must be at least 512 bits (64 bytes) long after Base64 decoding.");
            }
            this.SECRET_KEY = Keys.hmacShaKeyFor(decodedKey);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid JWT secret key. Please ensure it is a valid Base64-encoded string.", e);
        }
    }

    public String generateToken(String email) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationMs);

        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(SECRET_KEY, SignatureAlgorithm.HS512)
                .compact();
    }

    public String extractUsername(String token) {
        return getClaimsFromToken(token).getSubject();
    }

    public boolean validateToken(String token, String email) {
        try {
            final String usernameFromToken = extractUsername(token);
            return (usernameFromToken.equals(email) && !isTokenExpired(token));
        } catch (JwtException | IllegalArgumentException e) {
            // Token is invalid
            return false;
        }
    }

    private Claims getClaimsFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private boolean isTokenExpired(String token) {
        Date expiration = getClaimsFromToken(token).getExpiration();
        return expiration.before(new Date());
    }
}
