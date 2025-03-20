package com.baranbasaran.cheaperbook.dto.response.user;

import com.baranbasaran.cheaperbook.dto.response.address.AddressResponse;
import com.baranbasaran.cheaperbook.model.User;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private String name;
    private String avatarUrl;
    private String phoneNumber;
    private LocalDate birthDate;
    private AddressResponse address;
    private int followersCount;
    private int followingCount;

    public static UserResponse from(User user) {
        if (user == null) {
            return null;
        }
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .name(user.getName())
                .avatarUrl(user.getAvatarUrl())
                .phoneNumber(user.getPhoneNumber())
                .birthDate(user.getBirthDate())
                .address(AddressResponse.from(user.getAddress()))
                .followersCount(user.getFollowers().size())
                .followingCount(user.getFollowing().size())
                .build();
    }
} 