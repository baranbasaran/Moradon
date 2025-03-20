package com.baranbasaran.cheaperbook.dto.request.comment;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class CreateCommentRequest extends CommentRequest {
    @NotNull(message = "Post ID is required")
    private Long postId;
} 