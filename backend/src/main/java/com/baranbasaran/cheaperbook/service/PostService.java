package com.baranbasaran.cheaperbook.service;

import com.baranbasaran.cheaperbook.dto.PostDto;
import com.baranbasaran.cheaperbook.model.Post;
import com.baranbasaran.cheaperbook.model.User;
import com.baranbasaran.cheaperbook.repository.PostRepository;
import com.baranbasaran.cheaperbook.exception.PostNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final MediaService mediaService; // Inject MediaService

    // Create a new post
    public Post createPost(Post post) {
        return postRepository.save(post);
    }

    // Find post by ID
    public Post findPostById(Long postId) {
        return postRepository.findById(postId)
                .orElseThrow(() -> new PostNotFoundException(postId));
    }

    // Get all posts by a specific user
    public List<Post> getPostsByUser(User user) {
        List<Post> posts = postRepository.findAllByUser(user, Sort.by(Sort.Direction.DESC, "createdAt"));

        return posts;
    }

    // Delete a post by ID
    public void deletePost(Long postId, User user) {
        Post post = findPostById(postId);
        if (!post.getUser().equals(user)) {
            throw new SecurityException("You are not authorized to delete this post.");
        }
        postRepository.delete(post);
    }

    // Fetch all posts (for the timeline or feed)
    // Fetch all posts (for the timeline or feed) and order by latest
    public List<PostDto> getAllPosts() {
        List<Post> posts = postRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));

        return posts.stream().map(post -> {
            PostDto postDto = PostDto.from(post);

            // Check if mediaUrl exists and pass the URL to the front end
            if (post.getMediaUrl() != null) {
                postDto.setMediaUrl(post.getMediaUrl());
            }

            return postDto;
        }).collect(Collectors.toList());
    }


}
