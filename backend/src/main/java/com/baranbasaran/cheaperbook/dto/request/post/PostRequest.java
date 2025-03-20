package com.baranbasaran.cheaperbook.dto.request.post;

import com.baranbasaran.cheaperbook.model.Post;
import com.baranbasaran.cheaperbook.model.User;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostRequest {
    @NotBlank(message = "Content is required")
    @Size(max = 1000, message = "Content must not exceed 1000 characters")
    private String content;

    private String mediaUrl;
    private MultipartFile media;
    private User user;

    public Post toPost() {
        return Post.builder()
                .content(content)
                .mediaUrl(mediaUrl)
                .user(user)
                .build();
    }
}
