package com.baranbasaran.cheaperbook.dto.response.post;

import com.baranbasaran.cheaperbook.model.Post;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostResponse {
    private Long id;
    private String content;
    private String username;
    private Long userId;
    private String mediaUrl;
    private Long likes;
    private Long views;
    private Long reposts;
    private Long commentCount;
    private LocalDateTime createdAt;
    private String userAvatar;

    public static PostResponse from(Post post) {
        return PostResponse.builder()
                .id(post.getId())
                .content(post.getContent())
                .username(post.getUser().getUsername())
                .userId(post.getUser().getId())
                .mediaUrl(post.getMediaUrl())
                .likes(post.getLikes())
                .views(post.getViews())
                .reposts(post.getReposts())
                .commentCount((long) post.getComments().size())
                .createdAt(post.getCreatedAt())
                .userAvatar(post.getUser().getAvatarUrl())
                .build();
    }
} 