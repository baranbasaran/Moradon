package com.baranbasaran.cheaperbook.dto.response.comment;

import com.baranbasaran.cheaperbook.model.Comment;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class CommentResponse {
    private Long id;
    private String content;
    private String username;
    private LocalDateTime createdAt;
    private List<String> mediaUrls;
    private List<CommentResponse> replies;
    private Long parentCommentId;
    private Integer likes;
    private Integer reposts;
    private Boolean liked;
    private Boolean reposted;

    public static CommentResponse fromComment(Comment comment) {
        CommentResponse response = new CommentResponse();
        response.setId(comment.getId());
        response.setContent(comment.getContent());
        response.setUsername(comment.getUser().getUsername());
        response.setCreatedAt(comment.getCreatedAt());
        response.setMediaUrls(comment.getMediaUrls());
        response.setLikes(comment.getLikes());
        response.setReposts(comment.getReposts());
        response.setLiked(comment.getLiked());
        response.setReposted(comment.getReposted());
        if (comment.getParentComment() != null) {
            response.setParentCommentId(comment.getParentComment().getId());
        }

        if (comment.getReplies() != null) {
            response.setReplies(comment.getReplies().stream()
                    .map(CommentResponse::fromComment)
                    .collect(Collectors.toList()));
        }

        return response;
    }
} 