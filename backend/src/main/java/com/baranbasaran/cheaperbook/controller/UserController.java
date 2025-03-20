package com.baranbasaran.cheaperbook.controller;

import com.baranbasaran.cheaperbook.common.dto.Response;
import com.baranbasaran.cheaperbook.dto.request.user.CreateUserRequest;
import com.baranbasaran.cheaperbook.dto.request.user.UpdateUserRequest;
import com.baranbasaran.cheaperbook.dto.response.user.UserResponse;
import com.baranbasaran.cheaperbook.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public Response<Page<UserResponse>> getUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return Response.success(userService.getAllUsers(page, size));
    }

    @GetMapping("/{id}")
    public Response<UserResponse> getUserById(@PathVariable Long id) {
        return Response.success(UserResponse.from(userService.findUserById(id)));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Response<UserResponse> createUser(@RequestBody @Valid CreateUserRequest userRequest) {
        return Response.success(UserResponse.from(userService.createUser(userRequest)));
    }

    @PutMapping("/{id}")
    public Response<UserResponse> updateUser(@PathVariable Long id, @RequestBody @Valid UpdateUserRequest userRequest) {
        return Response.success(UserResponse.from(userService.updateUser(id, userRequest)));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }
}
