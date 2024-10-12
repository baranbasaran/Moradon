package com.baranbasaran.cheaperbook.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommentDto {
    private Long id;         // Comment ID
    private String content;  // Comment content
    private Long postId;     // ID of the associated post
    private Long userId;     // ID of the user who made the comment
}
