package com.baranbasaran.cheaperbook.controller.request.User;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserRequest {

        private long id;

        @Size(min = 1, max = 50, message = "must be between 1 and 50 characters")
        private String name;

        @Size(min = 1, max = 50, message = "must be between 1 and 50 characters")
        private String surname;

        @Pattern(regexp = "^(.+)@(.+)$", message = "must be a valid email")
        private String email;

        @Size(min = 8, max = 50, message = "must be between 8 and 50 characters")
        private String password;

        @Pattern(regexp = "^([0-9]{10})$", message = "must be 10 digits")
        private String phoneNumber;

        @Size(min = 1, max = 100, message = "must be between 1 and 100 characters")
        private String address;

        @Size(min = 1, max = 50, message = "must be between 1 and 50 characters")
        private String city;

        @Size(min = 1, max = 50, message = "must be between 1 and 50 characters")
        private String country;
}
