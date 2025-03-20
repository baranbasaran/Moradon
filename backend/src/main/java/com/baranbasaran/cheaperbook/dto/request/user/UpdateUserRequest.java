package com.baranbasaran.cheaperbook.dto.request.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UpdateUserRequest {
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    private String username;

    @Email(message = "Invalid email format")
    private String email;

    @Size(min = 6, message = "Password must be at least 6 characters long")
    private String password;

    private String name;
    private String phoneNumber;
    private LocalDate birthDate;
    private com.baranbasaran.cheaperbook.dto.request.user.Address address;
}
