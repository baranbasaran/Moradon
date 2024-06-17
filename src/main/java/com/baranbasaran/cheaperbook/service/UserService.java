package com.baranbasaran.cheaperbook.service;

import com.baranbasaran.cheaperbook.controller.request.User.CreateUserRequest;
import com.baranbasaran.cheaperbook.controller.request.User.UpdateUserRequest;
import com.baranbasaran.cheaperbook.controller.request.User.UserRequest;
import com.baranbasaran.cheaperbook.dto.UserDto;
import com.baranbasaran.cheaperbook.exception.InvalidRequestException;
import com.baranbasaran.cheaperbook.exception.UserAlreadyExistsException;
import com.baranbasaran.cheaperbook.exception.UserNotFoundException;
import com.baranbasaran.cheaperbook.model.User;
import com.baranbasaran.cheaperbook.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Caching;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public List<UserDto> findAll() {
        return userRepository.findAll().stream()
            .map(UserDto::from)
            .toList();
    }

    public UserDto findById(Long id) {
        return UserDto.from(userRepository.findById(id).orElseThrow(() -> new UserNotFoundException(id)));
    }

    public UserDto create(CreateUserRequest userRequest) {
        userRequest.setPassword(passwordEncoder.encode(userRequest.getPassword()));
        return UserDto.from(userRepository.save(createOrGetExistingUserFromRequest(userRequest)));
    }

    public UserDto update(Long id, UpdateUserRequest userRequest) {
        userRequest.setId(id);
        return UserDto.from(userRepository.save(updateUser(userRequest)));
    }

    public void delete(Long id) {
        userRepository.deleteById(id);
    }

    public User getUserById(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new UserNotFoundException(id));
    }

    @Transactional
    public User updateUser(UpdateUserRequest request) {
        User user = userRepository.findById(request.getId())
            .orElseThrow(() -> new UserNotFoundException(request.getId()));

        if (request.getName() != null) {
            user.setName(request.getName());
        }
        if (request.getSurname() != null) {
            user.setSurname(request.getSurname());
        }
        if (request.getEmail() != null) {
            user.setEmail(request.getEmail());
        }
        if (request.getUsername() != null) {
            user.setUsername(request.getUsername());
        }
        if (request.getPassword() != null) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        if (request.getPhoneNumber() != null) {
            user.setPhoneNumber(request.getPhoneNumber());
        }
        if (request.getAddress() != null) {
            user.setAddress(request.getAddress().to());
        }
        if (request.getBirthDate() != null) {
            user.setBirthDate(request.getBirthDate());
        }
        return user;
    }

    @Transactional
    public User createOrGetExistingUserFromRequest(UserRequest request) {
        if (request == null || !request.isValid()) {
            throw new InvalidRequestException("Invalid request");
        }

        User user = null;
        if (request.getId() != null) {
            user = userRepository.findById(request.getId())
                .orElseThrow(() -> new UserNotFoundException(request.getId()));
        }

        if (user != null) {
            throw new UserAlreadyExistsException("User already exists");
        }
        user = User.builder()
            .name(request.getName())
            .surname(request.getSurname())
            .username(request.getUsername())
            .email(request.getEmail())
            .password(request.getPassword())
            .phoneNumber(request.getPhoneNumber())
            .birthDate(request.getBirthDate())
            .address(request.getAddress().to())
            .build();
        return user;
    }

    @Caching(evict = {
        @CacheEvict(value = "followers", key = "'followers_' + #userToFollowId"),
        @CacheEvict(value = "followings", key = "'followings_' + #userId")
    })
    public void followUser(Long userId, Long userToFollowId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException(userId));
        User userToFollow = userRepository.findById(userToFollowId).orElseThrow(() -> new UserNotFoundException(userToFollowId));

        if (userToFollow.getFollowers().contains(user)) {
            return;
        }

        user.follow(userToFollow);
        userRepository.save(user);
    }

    @Caching(evict = {
        @CacheEvict(value = "followers", key = "'followers_' + #userToUnfollowId"),
        @CacheEvict(value = "followings", key = "'followings_' + #userId")
    })
    public void unfollowUser(Long userId, Long userToUnfollowId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException(userId));
        User userToUnfollow = userRepository.findById(userToUnfollowId).orElseThrow(() -> new UserNotFoundException(userToUnfollowId));

        if (!userToUnfollow.getFollowers().contains(user)) {
            return;
        }

        user.unfollow(userToUnfollow);
        userRepository.save(user);
    }

    @CachePut(value = "followers", key = "'followers_' + #userId", unless = "#result.size() == 0")
    public List<UserDto> getFollowers(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException(userId));
        return user.getFollowers().stream()
            .map(UserDto::from)
            .toList();
    }

    @CachePut(value = "followings", key = "'followings_' + #userId", unless = "#result.size() == 0")
    public List<UserDto> getFollowings(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException(userId));
        return user.getFollowing().stream()
            .map(UserDto::from)
            .toList();
    }
}
