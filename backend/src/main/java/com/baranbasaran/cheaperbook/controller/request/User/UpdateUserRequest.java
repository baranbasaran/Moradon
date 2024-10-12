package com.baranbasaran.cheaperbook.controller.request.User;

import jakarta.validation.constraints.Size;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class UpdateUserRequest extends UserRequest {

    @Size(min = 6, max = 50, message = "Password must be between 6 and 50 characters")
    private String password;
}
