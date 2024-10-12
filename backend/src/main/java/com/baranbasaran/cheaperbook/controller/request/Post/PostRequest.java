package com.baranbasaran.cheaperbook.controller.request.Post;

import com.baranbasaran.cheaperbook.model.Post;
import com.baranbasaran.cheaperbook.model.User;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostRequest {

    @Size(max = 280, message = "Content must be between 1 and 280 characters")
    @NotBlank(message = "Content cannot be empty")
    private String content;

    public Post to(User user) {
        return Post.builder()
                .content(this.content)
                .user(user)
                .build();
    }
}
