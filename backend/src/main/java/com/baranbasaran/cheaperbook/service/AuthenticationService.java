package com.baranbasaran.cheaperbook.service;

import com.baranbasaran.cheaperbook.controller.request.User.AuthLoginRequest;
import com.baranbasaran.cheaperbook.controller.request.User.CreateUserRequest;
import com.baranbasaran.cheaperbook.dto.AuthResponse;
import com.baranbasaran.cheaperbook.dto.UserDto;
import com.baranbasaran.cheaperbook.exception.UserNotFoundException;
import com.baranbasaran.cheaperbook.model.User;
import com.baranbasaran.cheaperbook.repository.UserRepository;
import com.baranbasaran.cheaperbook.security.JwtTokenUtil;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {

    private final UserRepository userRepository;
    private final JwtTokenUtil jwtTokenUtil;
    private final PasswordEncoder passwordEncoder;

    public AuthenticationService(UserRepository userRepository,
                                 JwtTokenUtil jwtTokenUtil,
                                 PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.jwtTokenUtil = jwtTokenUtil;
        this.passwordEncoder = passwordEncoder;
    }

    public User getAuthenticatedUser() {
        // Retrieve the authentication principal from the security context
        UserDetails principal = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email = principal.getUsername();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }

    public AuthResponse login(AuthLoginRequest request) {
        // Retrieve the user by email, username, or phone number
        User user = userRepository.findByEmail(request.getIdentifier())
                .orElseGet(() -> userRepository.findByUsername(request.getIdentifier())
                        .orElseGet(() -> userRepository.findByPhoneNumber(request.getIdentifier())
                                .orElseThrow(() -> new UserNotFoundException("User not found."))));

        // Check if the password matches
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid credentials.");
        }

        // Generate JWT token
        String token = jwtTokenUtil.generateToken(user.getEmail());

        // Return the authentication response
        return new AuthResponse(token, UserDto.from(user));
    }
    public AuthResponse signUp(CreateUserRequest request) {
        // Check if user with email or username already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already in use.");
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username is already taken.");
        }

        // Create a new user entity
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setName(request.getName());
        user.setUsername(request.getUsername());
        user.setBirthDate(request.getBirthDate());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setProfilePicture(request.getProfilePicture());
        // Set other fields as necessary

        // Save the user to the database
        userRepository.save(user);

        // Generate JWT token
        String token = jwtTokenUtil.generateToken(user.getEmail());

        // Return the authentication response
        return new AuthResponse(token, UserDto.from(user));
    }
}
