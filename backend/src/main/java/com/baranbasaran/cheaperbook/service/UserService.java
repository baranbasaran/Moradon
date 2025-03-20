package com.baranbasaran.cheaperbook.service;

import com.baranbasaran.cheaperbook.dto.request.user.CreateUserRequest;
import com.baranbasaran.cheaperbook.dto.request.user.UpdateUserRequest;
import com.baranbasaran.cheaperbook.dto.response.user.UserResponse;
import com.baranbasaran.cheaperbook.exception.InvalidRequestException;
import com.baranbasaran.cheaperbook.exception.UserAlreadyExistsException;
import com.baranbasaran.cheaperbook.exception.UserNotFoundException;
import com.baranbasaran.cheaperbook.model.User;
import com.baranbasaran.cheaperbook.repository.UserRepository;
import com.baranbasaran.cheaperbook.security.JwtTokenUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Caching;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Set;

public interface UserService {
    User createUser(CreateUserRequest request);
    User findUserById(Long id);
    User findUserByUsername(String username);
    User findUserByEmail(String email);
    Page<UserResponse> getAllUsers(int page, int size);
    User updateUser(Long id, UpdateUserRequest request);
    void deleteUser(Long id);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    List<UserResponse> findAll();
    UserResponse findById(Long id);
    UserResponse create(CreateUserRequest request);
    UserResponse update(Long id, UpdateUserRequest request);
    void delete(Long id);
    void followUser(Long userId, Long userToFollowId);
    void unfollowUser(Long userId, Long userToUnfollowId);
    Set<UserResponse> getFollowers(Long userId);
    Set<UserResponse> getFollowings(Long userId);
    User getUserById(Long id);
    User getAuthenticatedUser();
}
