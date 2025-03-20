package com.baranbasaran.cheaperbook.service.impl;

import com.baranbasaran.cheaperbook.dto.request.post.PostRequest;
import com.baranbasaran.cheaperbook.dto.response.post.PostResponse;
import com.baranbasaran.cheaperbook.exception.PostNotFoundException;
import com.baranbasaran.cheaperbook.model.Post;
import com.baranbasaran.cheaperbook.model.User;
import com.baranbasaran.cheaperbook.repository.PostRepository;
import com.baranbasaran.cheaperbook.service.MediaService;
import com.baranbasaran.cheaperbook.service.PostService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {

    private static final Logger logger = LoggerFactory.getLogger(PostServiceImpl.class);
    private final PostRepository postRepository;
    private final MediaService mediaService;

    @Override
    @Transactional
    public Post createPost(PostRequest postRequest) {
        logger.info("Creating new post with content: {}", postRequest.getContent());
        logger.debug("Post details - User: {}, Media URL: {}", postRequest.getUser().getUsername(), postRequest.getMediaUrl());
        Post savedPost = postRepository.save(postRequest.toPost());
        logger.info("Post created successfully with ID: {}", savedPost.getId());
        return savedPost;
    }

    @Override
    public Post findPostById(Long id) {
        logger.info("Finding post with ID: {}", id);
        return postRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("Post not found with ID: {}", id);
                    return new PostNotFoundException(id);
                });
    }

    @Override
    public Page<PostResponse> getPostsByUser(User user, int page, int size) {
        logger.info("Fetching posts for user: {} with pagination - page: {}, size: {}", user.getUsername(), page, size);
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Post> posts = postRepository.findAllByUser(user, pageable);
        Page<PostResponse> response = posts.map(PostResponse::from);
        logger.debug("Found {} posts for user {}", response.getContent().size(), user.getUsername());
        return response;
    }

    @Override
    @Transactional
    public void deletePost(Long id, User user) {
        logger.info("Attempting to delete post with ID: {}", id);
        Post post = findPostById(id);
        if (!post.getUser().equals(user)) {
            throw new SecurityException("You are not authorized to delete this post.");
        }
        postRepository.delete(post);
        logger.info("Post {} deleted successfully", id);
    }

    @Override
    public Page<PostResponse> getAllPosts(int page, int size) {
        logger.info("Fetching all posts with pagination - page: {}, size: {}", page, size);
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Post> posts = postRepository.findAll(pageable);
        Page<PostResponse> response = posts.map(PostResponse::from);
        logger.debug("Found {} total posts", response.getContent().size());
        return response;
    }

    @Override
    @Transactional
    public Post likePost(Long id) {
        logger.info("Liking post with ID: {}", id);
        Post post = findPostById(id);
        post.setLikes(post.getLikes() + 1);
        Post updatedPost = postRepository.save(post);
        logger.debug("Post liked successfully - new like count: {}", updatedPost.getLikes());
        return updatedPost;
    }

    @Override
    @Transactional
    public Post unlikePost(Long id) {
        logger.info("Unliking post with ID: {}", id);
        Post post = findPostById(id);
        if (post.getLikes() > 0) {
            post.setLikes(post.getLikes() - 1);
            Post updatedPost = postRepository.save(post);
            logger.debug("Post unliked successfully - new like count: {}", updatedPost.getLikes());
            return updatedPost;
        }
        return post;
    }

    @Override
    @Transactional
    public Post incrementViews(Long postId) {
        logger.info("Incrementing views for post with ID: {}", postId);
        Post post = findPostById(postId);
        post.setViews(post.getViews() + 1);
        Post updatedPost = postRepository.save(post);
        logger.debug("Post views incremented successfully - new view count: {}", updatedPost.getViews());
        return updatedPost;
    }

    @Override
    @Transactional
    public Post repost(Long id) {
        logger.info("Reposting post with ID: {}", id);
        Post post = findPostById(id);
        post.setReposts(post.getReposts() + 1);
        Post updatedPost = postRepository.save(post);
        logger.debug("Post reposted successfully - new repost count: {}", updatedPost.getReposts());
        return updatedPost;
    }
} 