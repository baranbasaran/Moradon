package com.baranbasaran.cheaperbook.service;

import com.baranbasaran.cheaperbook.dto.response.comment.CommentResponse;

import java.util.List;

public interface CommentService {
    CommentResponse createComment(Long postId, String content, Long parentCommentId);
    List<CommentResponse> getCommentsByPostId(Long postId);
    void deleteComment(Long id);
}
