package com.baranbasaran.cheaperbook.dto;

import com.baranbasaran.cheaperbook.model.Post;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class PostDto {
    private Long id;
    private String content;
    private String username;
    private LocalDateTime createdAt;
    private String mediaUrl;  // Include media URL in response

    public static PostDto from(Post post) {
        return PostDto.builder()
                .id(post.getId())
                .content(post.getContent())
                .username(post.getUser().getUsername())
                .createdAt(post.getCreatedAt())
                .mediaUrl(post.getMediaUrl())
                .build();
    }
}
