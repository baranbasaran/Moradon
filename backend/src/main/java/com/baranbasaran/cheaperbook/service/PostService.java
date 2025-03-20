package com.baranbasaran.cheaperbook.service;

import com.baranbasaran.cheaperbook.dto.request.post.PostRequest;
import com.baranbasaran.cheaperbook.dto.response.post.PostResponse;
import com.baranbasaran.cheaperbook.model.Post;
import com.baranbasaran.cheaperbook.model.User;
import org.springframework.data.domain.Page;

public interface PostService {
    Post createPost(PostRequest postRequest);
    Post findPostById(Long postId);
    Page<PostResponse> getPostsByUser(User user, int page, int size);
    void deletePost(Long postId, User user);
    Page<PostResponse> getAllPosts(int page, int size);
    Post likePost(Long postId);
    Post unlikePost(Long postId);
    Post incrementViews(Long postId);
    Post repost(Long postId);
}
