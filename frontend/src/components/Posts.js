import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaComment, FaHeart, FaShareAlt } from "react-icons/fa";
import { likePost, addComment } from "../redux/postSlice";
import CommentComposer from "./CommentComposer";
import "../styles/Posts.css";

const Posts = () => {
  const posts = useSelector((state) => state.posts.posts);
  const dispatch = useDispatch();
  const [commentComposerOpen, setCommentComposerOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const formatTimeDifference = (createdAt) => {
    const now = new Date();
    const postDate = new Date(createdAt);
    const diffInMinutes = Math.floor((now - postDate) / 60000);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    return diffInHours < 24
      ? `${diffInHours}h ago`
      : `${Math.floor(diffInHours / 24)}d ago`;
  };

  const handleLike = (postId) => {
    dispatch(likePost(postId));
  };

  const handleComment = (post) => {
    setSelectedPost(post); // Set the selected post
    setCommentComposerOpen(true);
  };

  const submitComment = (commentText) => {
    if (selectedPost) {
      dispatch(
        addComment({
          postId: selectedPost.id,
          commentText,
          userId: selectedPost.userId,
        })
      ); // Send userId with the comment
      setCommentComposerOpen(false);
    }
  };

  if (!posts || posts.length === 0) {
    return <p>No posts available yet!</p>;
  }

  return (
    <div className="posts-container">
      {posts.map((post) => (
        <div className="post-item" key={post.id}>
          <div className="post-content-container">
            <div className="post-avatar">
              <img src={post.avatarUrl} alt="Avatar" className="avatar" />
            </div>
            <div className="post-main-content">
              <div className="post-header">
                <div className="post-details">
                  <span className="post-name">Baran Basaran</span>
                  <span className="post-username">@{post.username}</span>
                </div>
                <span className="post-time">
                  {formatTimeDifference(post.createdAt)}
                </span>
              </div>
              <div className="post-content">{post.content}</div>
              {post.mediaUrl && (
                <div className="post-media">
                  {post.mediaUrl.endsWith(".mp4") ? (
                    <video
                      src={post.mediaUrl}
                      controls
                      className="media-video"
                    />
                  ) : (
                    <img
                      src={post.mediaUrl}
                      alt="Post media"
                      className="media-img"
                    />
                  )}
                </div>
              )}
              <div className="post-actions">
                <div
                  className="post-action-item"
                  onClick={() => handleComment(post)} // Pass the entire post to the comment handler
                >
                  <FaComment className="post-icon" />
                  <span className="action-count">
                    {post.commentCount ? post.commentCount : 0}
                  </span>
                </div>
                <div
                  className="post-action-item"
                  onClick={() => handleLike(post.id)}
                >
                  <FaHeart className="post-icon" />
                  <span className="action-count">{post.likes || 0}</span>
                </div>
                <div className="post-action-item">
                  <FaShareAlt className="post-icon" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {commentComposerOpen && selectedPost && (
        <CommentComposer
          selectedPost={selectedPost} // Pass the selected post including userId
          onSubmit={submitComment}
          onClose={() => setCommentComposerOpen(false)}
        />
      )}
    </div>
  );
};

export default Posts;
