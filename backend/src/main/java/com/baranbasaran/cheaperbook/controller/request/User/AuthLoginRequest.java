package com.baranbasaran.cheaperbook.controller.request.User;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class AuthLoginRequest {

    @NotBlank(message = "Email, username, or phone number is required")
    private String identifier; // Can be email, username, or phone number

    @NotBlank(message = "Password is required")
    private String password;
}
