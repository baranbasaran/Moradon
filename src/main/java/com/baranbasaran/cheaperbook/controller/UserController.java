package com.baranbasaran.cheaperbook.controller;

import com.baranbasaran.cheaperbook.common.dto.Response;
import com.baranbasaran.cheaperbook.controller.request.User.CreateUserRequest;
import com.baranbasaran.cheaperbook.controller.request.User.UpdateUserRequest;
import com.baranbasaran.cheaperbook.dto.UserDto;
import com.baranbasaran.cheaperbook.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/{id}")
    public Response<UserDto> getUserById(@PathVariable Long id) {
        return Response.success(userService.findById(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Response<UserDto> createUser(@RequestBody @Valid CreateUserRequest userRequest) {
        return Response.success(userService.create(userDto));
    }

    @PutMapping("/{id}")
    public Response<UserDto> updateUser(@PathVariable Long id, @RequestBody @Valid UpdateUserRequest userRequest) {
        return Response.success(userService.update(id, userDto));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteUser(@PathVariable Long id) {
        userService.delete(id);
    }
}