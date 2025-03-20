package com.baranbasaran.cheaperbook.controller;

import com.baranbasaran.cheaperbook.dto.request.post.PostRequest;
import com.baranbasaran.cheaperbook.dto.response.post.PostResponse;
import com.baranbasaran.cheaperbook.dto.response.comment.CommentResponse;
import com.baranbasaran.cheaperbook.model.Post;
import com.baranbasaran.cheaperbook.model.User;
import com.baranbasaran.cheaperbook.service.AuthenticationService;
import com.baranbasaran.cheaperbook.service.CommentService;
import com.baranbasaran.cheaperbook.service.MediaService;
import com.baranbasaran.cheaperbook.service.PostService;
import com.baranbasaran.cheaperbook.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/v1/posts")
@RequiredArgsConstructor
public class PostController {

    private static final Logger logger = LoggerFactory.getLogger(PostController.class);
    private final PostService postService;
    private final UserService userService;
    private final AuthenticationService authenticationService;
    private final MediaService mediaService;
    private final CommentService commentService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<PostResponse> createPost(
            @RequestParam("content") String content,
            @RequestParam(value = "mediaFile", required = false) MultipartFile mediaFile
    ) {
        logger.info("Received create post request - Content: {}", content);
        if (mediaFile != null) {
            logger.info("Media file received - Name: {}, Size: {}", mediaFile.getOriginalFilename(), mediaFile.getSize());
        }

        User authenticatedUser = authenticationService.getAuthenticatedUser();
        logger.debug("Authenticated user: {}", authenticatedUser.getUsername());

        String mediaUrl = null;
        if (mediaFile != null && !mediaFile.isEmpty()) {
            mediaUrl = mediaService.uploadFile(mediaFile);
            logger.info("Media uploaded successfully, URL: {}", mediaUrl);
        }

        PostRequest postRequest = PostRequest.builder()
                .content(content)
                .mediaUrl(mediaUrl)
                .user(authenticatedUser)
                .build();

        Post createdPost = postService.createPost(postRequest);
        PostResponse response = PostResponse.from(createdPost);
        logger.info("Post created successfully: {}", response);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostResponse> getPost(@PathVariable Long id) {
        logger.info("Fetching post with ID: {}", id);
        Post post = postService.findPostById(id);
        PostResponse response = PostResponse.from(post);
        logger.debug("Retrieved post: {}", response);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<PostResponse>> getPostsByUser(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        logger.info("Fetching posts for user ID: {} with pagination - page: {}, size: {}", userId, page, size);
        User user = userService.getUserById(userId);
        Page<PostResponse> response = postService.getPostsByUser(user, page, size);
        logger.debug("Retrieved {} posts for user {}", response.getContent().size(), userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<Page<PostResponse>> getAllPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        logger.info("Fetching all posts with pagination - page: {}, size: {}", page, size);
        Page<PostResponse> response = postService.getAllPosts(page, size);
        logger.debug("Retrieved {} total posts", response.getContent().size());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePost(@PathVariable Long id) {
        logger.info("Attempting to delete post with ID: {}", id);
        User authenticatedUser = authenticationService.getAuthenticatedUser();
        postService.deletePost(id, authenticatedUser);
        logger.info("Post deleted successfully");
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<PostResponse> likePost(@PathVariable Long id) {
        logger.info("Liking post with ID: {}", id);
        Post post = postService.likePost(id);
        PostResponse response = PostResponse.from(post);
        logger.debug("Post liked successfully: {}", response);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/unlike")
    public ResponseEntity<PostResponse> unlikePost(@PathVariable Long id) {
        logger.info("Unliking post with ID: {}", id);
        Post post = postService.unlikePost(id);
        PostResponse response = PostResponse.from(post);
        logger.debug("Post unliked successfully: {}", response);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/repost")
    public ResponseEntity<PostResponse> repost(@PathVariable Long id) {
        logger.info("Reposting post with ID: {}", id);
        Post post = postService.repost(id);
        PostResponse response = PostResponse.from(post);
        logger.debug("Post reposted successfully: {}", response);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}/comments")
    public ResponseEntity<List<CommentResponse>> getPostComments(@PathVariable Long id) {
        logger.info("Fetching comments for post ID: {}", id);
        List<CommentResponse> comments = commentService.getCommentsByPostId(id);
        logger.debug("Retrieved {} comments for post {}", comments.size(), id);
        return ResponseEntity.ok(comments);
    }
}
