package com.baranbasaran.cheaperbook.controller;

import com.baranbasaran.cheaperbook.controller.request.Post.PostRequest;
import com.baranbasaran.cheaperbook.dto.PostDto;
import com.baranbasaran.cheaperbook.model.Post;
import com.baranbasaran.cheaperbook.model.User;
import com.baranbasaran.cheaperbook.service.AuthenticationService;
import com.baranbasaran.cheaperbook.service.MediaService; // Add this
import com.baranbasaran.cheaperbook.service.PostService;
import com.baranbasaran.cheaperbook.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile; // Add this

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/v1/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;
    private final UserService userService;
    private final AuthenticationService authenticationService;
    private final MediaService mediaService; // Inject the mediaService

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<PostDto> createPost(
            @RequestParam("content") String content,
            @RequestParam(value = "mediaFile", required = false) MultipartFile mediaFile // Ensure it expects 'mediaFile'
    ) {
        User authenticatedUser = authenticationService.getAuthenticatedUser();

        String mediaUrl = null;
        if (mediaFile != null && !mediaFile.isEmpty()) {
            mediaUrl = mediaService.upload(mediaFile);
        }

        Post post = Post.builder()
                .content(content)
                .user(authenticatedUser)
                .mediaUrl(mediaUrl)
                .build();

        Post createdPost = postService.createPost(post);
        return new ResponseEntity<>(PostDto.from(createdPost), HttpStatus.CREATED);
    }




    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PostDto>> getPostsByUser(@PathVariable Long userId) {
        User user = userService.getUserById(userId); // Fetch user by ID
        List<Post> posts = postService.getPostsByUser(user);
        return new ResponseEntity<>(posts.stream().map(PostDto::from).collect(Collectors.toList()), HttpStatus.OK);
    }

    @DeleteMapping("/{postId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePost(@PathVariable Long postId) {
        User authenticatedUser = authenticationService.getAuthenticatedUser();
        postService.deletePost(postId, authenticatedUser);
    }

    @GetMapping
    public ResponseEntity<List<PostDto>> getAllPosts() {
        List<PostDto> posts = postService.getAllPosts();
        return new ResponseEntity<>(posts, HttpStatus.OK);

    }

}
