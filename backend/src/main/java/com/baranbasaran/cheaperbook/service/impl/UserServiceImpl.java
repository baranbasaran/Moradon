package com.baranbasaran.cheaperbook.service.impl;

import com.baranbasaran.cheaperbook.dto.request.user.CreateUserRequest;
import com.baranbasaran.cheaperbook.dto.request.user.UpdateUserRequest;
import com.baranbasaran.cheaperbook.dto.response.user.UserResponse;
import com.baranbasaran.cheaperbook.exception.UserAlreadyExistsException;
import com.baranbasaran.cheaperbook.exception.UserNotFoundException;
import com.baranbasaran.cheaperbook.model.User;
import com.baranbasaran.cheaperbook.repository.UserRepository;
import com.baranbasaran.cheaperbook.service.AuthenticationService;
import com.baranbasaran.cheaperbook.service.UserService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationService authenticationService;

    @Override
    @Transactional
    public User createUser(CreateUserRequest request) {
        logger.info("Creating new user with email: {}", request.getEmail());
        logger.debug("User creation request details - username: {}, name: {}", request.getUsername(), request.getName());
        
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            logger.error("User creation failed - email already exists: {}", request.getEmail());
            throw new UserAlreadyExistsException("User with this email already exists");
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .name(request.getName())
                .phoneNumber(request.getPhoneNumber())
                .birthDate(request.getBirthDate())
                .address(convertToModelAddress(request.getAddress()))
                .build();

        User savedUser = userRepository.save(user);
        logger.info("User created successfully with ID: {}", savedUser.getId());
        logger.debug("Created user details - ID: {}, username: {}, email: {}", 
            savedUser.getId(), savedUser.getUsername(), savedUser.getEmail());
        return savedUser;
    }

    private com.baranbasaran.cheaperbook.model.Address convertToModelAddress(com.baranbasaran.cheaperbook.dto.request.user.Address addressDto) {
        if (addressDto == null) {
            return null;
        }
        return com.baranbasaran.cheaperbook.model.Address.builder()
                .street(addressDto.getStreetAddress())
                .city(addressDto.getCity())
                .state(addressDto.getState())
                .country(addressDto.getCountry())
                .postalCode(addressDto.getPostalCode())
                .build();
    }

    @Override
    public User findUserById(Long id) {
        logger.info("Finding user with ID: {}", id);
        logger.debug("Attempting to find user in database");
        
        User user = userRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("User not found with ID: {}", id);
                    return new UserNotFoundException(id);
                });
        
        logger.debug("Found user - ID: {}, username: {}, email: {}", 
            user.getId(), user.getUsername(), user.getEmail());
        return user;
    }

    @Override
    public User findUserByUsername(String username) {
        logger.info("Finding user with username: {}", username);
        logger.debug("Attempting to find user in database");
        
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> {
                    logger.error("User not found with username: {}", username);
                    return new UserNotFoundException("User not found with username: " + username);
                });
        
        logger.debug("Found user - ID: {}, username: {}, email: {}", 
            user.getId(), user.getUsername(), user.getEmail());
        return user;
    }

    @Override
    public User findUserByEmail(String email) {
        logger.info("Finding user with email: {}", email);
        logger.debug("Attempting to find user in database");
        
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> {
                    logger.error("User not found with email: {}", email);
                    return new UserNotFoundException("User not found with email: " + email);
                });
        
        logger.debug("Found user - ID: {}, username: {}, email: {}", 
            user.getId(), user.getUsername(), user.getEmail());
        return user;
    }

    @Override
    public Page<UserResponse> getAllUsers(int page, int size) {
        logger.info("Fetching all users with pagination - page: {}, size: {}", page, size);
        logger.debug("Creating pageable request");
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<User> users = userRepository.findAll(pageable);
        Page<UserResponse> response = users.map(UserResponse::from);
        
        logger.debug("Found {} total users, current page: {}, total pages: {}", 
            response.getContent().size(), response.getNumber(), response.getTotalPages());
        return response;
    }

    @Override
    @Transactional
    public User updateUser(Long id, UpdateUserRequest request) {
        logger.info("Updating user with ID: {}", id);
        logger.debug("Update request details - name: {}, email: {}, username: {}", 
            request.getName(), request.getEmail(), request.getUsername());
        
        User user = findUserById(id);

        if (request.getName() != null) {
            logger.debug("Updating user name from '{}' to '{}'", user.getName(), request.getName());
            user.setName(request.getName());
        }
        if (request.getEmail() != null) {
            logger.debug("Updating user email from '{}' to '{}'", user.getEmail(), request.getEmail());
            user.setEmail(request.getEmail());
        }
        if (request.getUsername() != null) {
            logger.debug("Updating user username from '{}' to '{}'", user.getUsername(), request.getUsername());
            user.setUsername(request.getUsername());
        }
        if (request.getPassword() != null) {
            logger.debug("Updating user password");
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        if (request.getPhoneNumber() != null) {
            logger.debug("Updating user phone number from '{}' to '{}'", user.getPhoneNumber(), request.getPhoneNumber());
            user.setPhoneNumber(request.getPhoneNumber());
        }
        if (request.getAddress() != null) {
            logger.debug("Updating user address");
            user.setAddress(convertToModelAddress(request.getAddress()));
        }
        if (request.getBirthDate() != null) {
            logger.debug("Updating user birth date from '{}' to '{}'", user.getBirthDate(), request.getBirthDate());
            user.setBirthDate(request.getBirthDate());
        }

        User updatedUser = userRepository.save(user);
        logger.info("User updated successfully with ID: {}", updatedUser.getId());
        logger.debug("Updated user details - ID: {}, username: {}, email: {}", 
            updatedUser.getId(), updatedUser.getUsername(), updatedUser.getEmail());
        return updatedUser;
    }

    @Override
    @Transactional
    public void deleteUser(Long id) {
        logger.info("Deleting user with ID: {}", id);
        logger.debug("Attempting to find user before deletion");
        
        User user = findUserById(id);
        logger.debug("Found user to delete - ID: {}, username: {}, email: {}", 
            user.getId(), user.getUsername(), user.getEmail());
        
        userRepository.delete(user);
        logger.info("User deleted successfully with ID: {}", id);
    }

    @Override
    public boolean existsByUsername(String username) {
        logger.debug("Checking if user exists with username: {}", username);
        boolean exists = userRepository.findByUsername(username).isPresent();
        logger.debug("Username existence check result: {}", exists);
        return exists;
    }

    @Override
    public boolean existsByEmail(String email) {
        logger.debug("Checking if user exists with email: {}", email);
        boolean exists = userRepository.findByEmail(email).isPresent();
        logger.debug("Email existence check result: {}", exists);
        return exists;
    }

    @Override
    public List<UserResponse> findAll() {
        return userRepository.findAll().stream()
                .map(UserResponse::from)
                .collect(Collectors.toList());
    }

    @Override
    public UserResponse findById(Long id) {
        return UserResponse.from(findUserById(id));
    }

    @Override
    public UserResponse create(CreateUserRequest request) {
        return UserResponse.from(createUser(request));
    }

    @Override
    public UserResponse update(Long id, UpdateUserRequest request) {
        return UserResponse.from(updateUser(id, request));
    }

    @Override
    public void delete(Long id) {
        deleteUser(id);
    }

    @Override
    @Transactional
    public void followUser(Long userId, Long userToFollowId) {
        User user = findUserById(userId);
        User userToFollow = findUserById(userToFollowId);
        user.getFollowing().add(userToFollow);
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void unfollowUser(Long userId, Long userToUnfollowId) {
        User user = findUserById(userId);
        User userToUnfollow = findUserById(userToUnfollowId);
        user.getFollowing().remove(userToUnfollow);
        userRepository.save(user);
    }

    @Override
    public Set<UserResponse> getFollowers(Long userId) {
        User user = findUserById(userId);
        return user.getFollowers().stream()
                .map(UserResponse::from)
                .collect(Collectors.toSet());
    }

    @Override
    public Set<UserResponse> getFollowings(Long userId) {
        User user = findUserById(userId);
        return user.getFollowing().stream()
                .map(UserResponse::from)
                .collect(Collectors.toSet());
    }

    @Override
    public User getUserById(Long id) {
        return findUserById(id);
    }

    @Override
    public User getAuthenticatedUser() {
        return userRepository.findByEmail(authenticationService.getAuthenticatedUser().getEmail())
                .orElseThrow(() -> new UserNotFoundException("Authenticated user not found"));
    }
} 