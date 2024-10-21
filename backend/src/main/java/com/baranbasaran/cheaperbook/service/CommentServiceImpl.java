package com.baranbasaran.cheaperbook.service;

import com.baranbasaran.cheaperbook.dto.CommentDto;
import com.baranbasaran.cheaperbook.model.Comment;
import com.baranbasaran.cheaperbook.model.Post;
import com.baranbasaran.cheaperbook.model.User;
import com.baranbasaran.cheaperbook.repository.CommentRepository;
import com.baranbasaran.cheaperbook.repository.PostRepository;
import com.baranbasaran.cheaperbook.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public CommentServiceImpl(CommentRepository commentRepository, PostRepository postRepository, UserRepository userRepository) {
        this.commentRepository = commentRepository;
        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }

    @Override
    public CommentDto createComment(Long postId, CommentDto commentDto) {
        // Fetch the associated post using postId
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        // Fetch the associated user from commentDto
        User user = userRepository.findById(commentDto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Create a new Comment entity
        Comment comment = Comment.builder()
                .content(commentDto.getContent())
                .post(post)
                .user(user)
                .build();

        // Save the comment and return the DTO
        Comment savedComment = commentRepository.save(comment);
        return new CommentDto(savedComment.getId(), savedComment.getContent(), savedComment.getPost().getId(), savedComment.getUser().getId());
    }

    @Override
    public CommentDto updateComment(Long id, CommentDto commentDto) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        comment.setContent(commentDto.getContent());
        Comment updatedComment = commentRepository.save(comment);

        return new CommentDto(updatedComment.getId(), updatedComment.getContent(), updatedComment.getPost().getId(), updatedComment.getUser().getId());
    }

    @Override
    public List<CommentDto> getCommentsByPostId(Long postId) {
        List<Comment> comments = commentRepository.findByPostId(postId);
        return comments.stream()
                .map(comment -> new CommentDto(comment.getId(), comment.getContent(), comment.getPost().getId(), comment.getUser().getId()))
                .collect(Collectors.toList());
    }

    @Override
    public void deleteComment(Long id) {
        commentRepository.deleteById(id); // Implementing the delete logic
    }

}
