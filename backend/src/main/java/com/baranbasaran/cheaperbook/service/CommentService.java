package com.baranbasaran.cheaperbook.service;
import com.baranbasaran.cheaperbook.dto.CommentDto;

import java.util.List;

public interface CommentService {
    CommentDto createComment(CommentDto commentDTO);
    CommentDto updateComment(Long id, CommentDto commentDTO);
    void deleteComment(Long id);
    List<CommentDto> getCommentsByPostId(Long postId);
}
