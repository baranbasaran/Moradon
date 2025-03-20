package com.baranbasaran.cheaperbook.service.impl;

import com.baranbasaran.cheaperbook.dto.request.auth.LoginRequest;
import com.baranbasaran.cheaperbook.dto.request.auth.SignUpRequest;
import com.baranbasaran.cheaperbook.dto.response.auth.AuthResponse;
import com.baranbasaran.cheaperbook.dto.response.user.UserResponse;
import com.baranbasaran.cheaperbook.exception.InvalidCredentialsException;
import com.baranbasaran.cheaperbook.exception.UserNotFoundException;
import com.baranbasaran.cheaperbook.model.User;
import com.baranbasaran.cheaperbook.repository.UserRepository;
import com.baranbasaran.cheaperbook.security.JwtTokenUtil;
import com.baranbasaran.cheaperbook.service.AuthenticationService;
import com.baranbasaran.cheaperbook.service.TokenBlacklistService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {

    private final UserRepository userRepository;
    private final JwtTokenUtil jwtTokenUtil;
    private final PasswordEncoder passwordEncoder;
    private final TokenBlacklistService tokenBlacklistService;

    @Override
    public AuthResponse login(LoginRequest request) {
        log.info("Login attempt for user: {}", request.getIdentifier());
        log.debug("Processing login request with identifier type: {}", 
            request.getIdentifier().contains("@") ? "email" : 
            request.getIdentifier().matches("\\d+") ? "phone" : "username");
        
        // Validate input
        if (request.getIdentifier() == null || request.getIdentifier().trim().isEmpty()) {
            log.error("Login failed - empty identifier provided");
            throw new IllegalArgumentException("Login identifier cannot be empty");
        }

        // Try to find user with a single query
        User user = userRepository.findByEmailOrUsernameOrPhoneNumber(
                request.getIdentifier(),
                request.getIdentifier(),
                request.getIdentifier())
                .orElseThrow(() -> {
                    log.error("Login failed - user not found with identifier: {}", request.getIdentifier());
                    return new UserNotFoundException(
                            String.format("No user found with email, username, or phone number: %s", 
                            request.getIdentifier()));
                });

        log.debug("User found - ID: {}, username: {}", user.getId(), user.getUsername());

        // Check if the password matches
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            log.error("Login failed - invalid password for user: {}", request.getIdentifier());
            throw new InvalidCredentialsException("Invalid password");
        }

        log.debug("Password validation successful");

        // Generate JWT token with additional claims
        String token = jwtTokenUtil.generateTokenWithClaims(user);
        String refreshToken = jwtTokenUtil.generateRefreshToken(user);

        log.debug("Generated tokens - access token length: {}, refresh token length: {}", 
            token.length(), refreshToken.length());
        log.info("Login successful for user: {}", user.getUsername());

        return new AuthResponse(token, refreshToken, UserResponse.from(user));
    }

    @Override
    public AuthResponse signUp(SignUpRequest request) {
        log.info("Processing signup request for email: {}", request.getEmail());
        log.debug("Signup request details - username: {}, name: {}", request.getUsername(), request.getName());
        
        // Check if user with email or username already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            log.error("Signup failed - email already in use: {}", request.getEmail());
            throw new IllegalArgumentException("Email is already in use.");
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            log.error("Signup failed - username already taken: {}", request.getUsername());
            throw new IllegalArgumentException("Username is already taken.");
        }

        log.debug("Email and username validation successful");

        // Create a new user entity
        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .name(request.getName())
                .username(request.getUsername())
                .birthDate(request.getBirthDate())
                .phoneNumber(request.getPhoneNumber())
                .avatarUrl(request.getProfilePicture())
                .build();

        // Save the user to the database
        User savedUser = userRepository.save(user);
        log.debug("User saved to database - ID: {}", savedUser.getId());

        // Generate tokens
        String token = jwtTokenUtil.generateTokenWithClaims(user);
        String refreshToken = jwtTokenUtil.generateRefreshToken(user);

        log.debug("Generated tokens - access token length: {}, refresh token length: {}", 
            token.length(), refreshToken.length());
        log.info("Signup successful for user: {}", user.getUsername());

        return new AuthResponse(token, refreshToken, UserResponse.from(user));
    }

    @Override
    public User getCurrentUser() {
        log.debug("Retrieving current user from security context");
        UserDetails principal = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email = principal.getUsername();

        log.debug("Looking up user by email: {}", email);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> {
                    log.error("Current user not found in database - email: {}", email);
                    return new UserNotFoundException("User not found with email: " + email);
                });

        log.debug("Current user found - ID: {}, username: {}", user.getId(), user.getUsername());
        return user;
    }

    @Override
    public User getAuthenticatedUser() {
        return getCurrentUser();
    }

    @Override
    public AuthResponse refreshToken(String refreshToken) {
        log.info("Processing refresh token request");
        if (refreshToken == null || refreshToken.trim().isEmpty()) {
            throw new IllegalArgumentException("Refresh token cannot be empty");
        }

        try {
            // First validate the refresh token
            if (!jwtTokenUtil.validateRefreshToken(refreshToken)) {
                log.error("Invalid refresh token");
                throw new InvalidCredentialsException("Invalid refresh token");
            }

            String email = jwtTokenUtil.extractUsername(refreshToken);
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new UserNotFoundException("User not found with email: " + email));

            String newToken = jwtTokenUtil.generateTokenWithClaims(user);
            String newRefreshToken = jwtTokenUtil.generateRefreshToken(user);

            log.debug("Generated new tokens - access token length: {}, refresh token length: {}", 
                newToken.length(), newRefreshToken.length());
            log.info("Token refresh successful for user: {}", user.getUsername());

            return new AuthResponse(newToken, newRefreshToken, UserResponse.from(user));
        } catch (Exception e) {
            log.error("Token refresh failed: {}", e.getMessage());
            throw new InvalidCredentialsException("Invalid refresh token");
        }
    }

    @Override
    public void logout(String token) {
        log.info("Processing logout request");
        if (token != null) {
            log.debug("Blacklisting token with length: {}", token.length());
            // Blacklist the token
            tokenBlacklistService.blacklistToken(token);
            
            // Clear the security context
            SecurityContextHolder.clearContext();
            log.debug("Security context cleared");
            log.info("Logout successful");
        } else {
            log.warn("Logout called with null token");
        }
    }
} 