package com.baranbasaran.cheaperbook.service;

import com.baranbasaran.cheaperbook.model.Post;
import com.baranbasaran.cheaperbook.model.User;
import com.baranbasaran.cheaperbook.repository.PostRepository;
import com.baranbasaran.cheaperbook.exception.PostNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;

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
        return postRepository.findAllByUser(user);
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
    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }
}
