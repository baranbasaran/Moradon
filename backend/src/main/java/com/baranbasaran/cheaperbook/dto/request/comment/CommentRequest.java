package com.baranbasaran.cheaperbook.dto.request.comment;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@NoArgsConstructor
public class CommentRequest {
    @NotBlank(message = "Content cannot be empty")
    @Size(max = 1000, message = "Content must be between 1 and 1000 characters")
    private String content;

    private Long parentCommentId;
} 