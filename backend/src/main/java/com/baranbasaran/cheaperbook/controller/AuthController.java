package com.baranbasaran.cheaperbook.controller;

import com.baranbasaran.cheaperbook.controller.request.AuthLoginRequest;
import com.baranbasaran.cheaperbook.controller.request.User.CreateUserRequest;
import com.baranbasaran.cheaperbook.dto.UserDto;
import com.baranbasaran.cheaperbook.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @PostMapping("/login")
    public String login(@RequestBody @Valid AuthLoginRequest authLoginRequest) {
        return userService.login(authLoginRequest.getEmail(), authLoginRequest.getPassword());
    }

    @PostMapping("/signup")
    @ResponseStatus(HttpStatus.CREATED)
    public String signup(@RequestBody @Valid CreateUserRequest createUserRequest) {
        return userService.signUp(createUserRequest);
    }
}
