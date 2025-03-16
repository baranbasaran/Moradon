package com.baranbasaran.cheaperbook.security;

import com.baranbasaran.cheaperbook.model.User;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtTokenUtil {

    private final Key SECRET_KEY;
    private final Key REFRESH_SECRET_KEY;
    private final long jwtExpirationMs;
    private final long refreshTokenExpirationMs;

    public JwtTokenUtil(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.refresh-secret}") String refreshSecret,
            @Value("${jwt.expirationMs}") long jwtExpirationMs,
            @Value("${jwt.refresh-expirationMs}") long refreshTokenExpirationMs
    ) {
        this.jwtExpirationMs = jwtExpirationMs;
        this.refreshTokenExpirationMs = refreshTokenExpirationMs;

        try {
            byte[] decodedKey = Base64.getDecoder().decode(secret);
            byte[] decodedRefreshKey = Base64.getDecoder().decode(refreshSecret);
            
            if (decodedKey.length < 64 || decodedRefreshKey.length < 64) {
                throw new IllegalArgumentException("Secret keys must be at least 512 bits (64 bytes) long after Base64 decoding.");
            }
            
            this.SECRET_KEY = Keys.hmacShaKeyFor(decodedKey);
            this.REFRESH_SECRET_KEY = Keys.hmacShaKeyFor(decodedRefreshKey);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid JWT secret keys. Please ensure they are valid Base64-encoded strings.", e);
        }
    }

    public String generateTokenWithClaims(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", user.getId());
        claims.put("username", user.getUsername());
        claims.put("email", user.getEmail());
        // Add any other claims you want to include

        return generateToken(claims, user.getEmail(), jwtExpirationMs, SECRET_KEY);
    }

    public String generateRefreshToken(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("type", "refresh");
        return generateToken(claims, user.getEmail(), refreshTokenExpirationMs, REFRESH_SECRET_KEY);
    }

    private String generateToken(Map<String, Object> claims, String subject, long expirationMs, Key signingKey) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expirationMs);

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(signingKey, SignatureAlgorithm.HS512)
                .compact();
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject, SECRET_KEY);
    }

    public Long extractUserId(String token) {
        return extractClaim(token, claims -> claims.get("userId", Long.class), SECRET_KEY);
    }

    public boolean validateToken(String token, String email) {
        try {
            String usernameFromToken = extractUsername(token);
            return (usernameFromToken.equals(email) && !isTokenExpired(token, SECRET_KEY));
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    public boolean validateRefreshToken(String token) {
        try {
            return !isTokenExpired(token, REFRESH_SECRET_KEY) && 
                   "refresh".equals(extractClaim(token, claims -> claims.get("type"), REFRESH_SECRET_KEY));
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver, Key signingKey) {
        final Claims claims = extractAllClaims(token, signingKey);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token, Key signingKey) {
        return Jwts.parserBuilder()
                .setSigningKey(signingKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private boolean isTokenExpired(String token, Key signingKey) {
        final Date expiration = extractClaim(token, Claims::getExpiration, signingKey);
        return expiration.before(new Date());
    }
}
