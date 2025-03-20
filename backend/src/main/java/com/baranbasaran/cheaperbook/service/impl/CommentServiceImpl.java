package com.baranbasaran.cheaperbook.service.impl;

import com.baranbasaran.cheaperbook.model.Comment;
import com.baranbasaran.cheaperbook.model.Post;
import com.baranbasaran.cheaperbook.model.User;
import com.baranbasaran.cheaperbook.exception.ResourceNotFoundException;
import com.baranbasaran.cheaperbook.repository.CommentRepository;
import com.baranbasaran.cheaperbook.repository.PostRepository;
import com.baranbasaran.cheaperbook.service.AuthenticationService;
import com.baranbasaran.cheaperbook.service.CommentService;
import com.baranbasaran.cheaperbook.dto.response.comment.CommentResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {

    private static final Logger logger = LoggerFactory.getLogger(CommentServiceImpl.class);
    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final AuthenticationService authenticationService;

    @Override
    @Transactional
    public CommentResponse createComment(Long postId, String content, Long parentCommentId) {
        logger.info("Creating new comment for post {}", postId);
        logger.debug("Comment details - Content: {}, Parent Comment ID: {}", content, parentCommentId);

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> {
                    logger.error("Post not found with id: {}", postId);
                    return new ResourceNotFoundException("Post not found with id: " + postId);
                });

        User user = authenticationService.getAuthenticatedUser();
        logger.debug("Creating comment for authenticated user: {}", user.getUsername());

        Comment parentComment = null;
        if (parentCommentId != null) {
            logger.debug("Fetching parent comment with ID: {}", parentCommentId);
            parentComment = commentRepository.findById(parentCommentId)
                    .orElseThrow(() -> {
                        logger.error("Parent comment not found with id: {}", parentCommentId);
                        return new ResourceNotFoundException("Parent comment not found with id: " + parentCommentId);
                    });
        }

        Comment comment = Comment.builder()
                .content(content)
                .post(post)
                .user(user)
                .parentComment(parentComment)
                .createdAt(LocalDateTime.now())
                .build();

        Comment savedComment = commentRepository.save(comment);
        logger.info("Comment created successfully with ID: {}", savedComment.getId());
        return CommentResponse.fromComment(savedComment);
    }

    @Override
    public List<CommentResponse> getCommentsByPostId(Long postId) {
        logger.info("Fetching comments for post ID: {}", postId);
        List<Comment> comments = commentRepository.findByPostIdOrderByCreatedAtDesc(postId);
        logger.debug("Found {} comments for post {}", comments.size(), postId);

        List<CommentResponse> responses = comments.stream()
                .map(CommentResponse::fromComment)
                .collect(Collectors.toList());

        logger.info("Successfully converted {} comments to responses", responses.size());
        return responses;
    }

    @Override
    @Transactional
    public void deleteComment(Long id) {
        logger.info("Attempting to delete comment with ID: {}", id);
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("Comment not found with id: {}", id);
                    return new ResourceNotFoundException("Comment not found with id: " + id);
                });
        
        User authenticatedUser = authenticationService.getAuthenticatedUser();
        if (!comment.getUser().getId().equals(authenticatedUser.getId())) {
            throw new ResourceNotFoundException("You can only delete your own comments");
        }
        
        commentRepository.delete(comment);
        logger.info("Comment {} deleted successfully", id);
    }
} 