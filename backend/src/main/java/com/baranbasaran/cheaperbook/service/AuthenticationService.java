package com.baranbasaran.cheaperbook.service;

import com.baranbasaran.cheaperbook.dto.request.auth.LoginRequest;
import com.baranbasaran.cheaperbook.dto.request.auth.SignUpRequest;
import com.baranbasaran.cheaperbook.dto.response.auth.AuthResponse;
import com.baranbasaran.cheaperbook.model.User;

public interface AuthenticationService {
    AuthResponse login(LoginRequest request);
    AuthResponse signUp(SignUpRequest request);
    AuthResponse refreshToken(String refreshToken);
    User getAuthenticatedUser();
    User getCurrentUser();
    void logout(String token);
}
