import React from "react";
import { useSelector } from "react-redux";
import { FaComment, FaHeart, FaShareAlt } from "react-icons/fa"; // Icons for actions
import "../styles/Posts.css";

const Posts = () => {
  const posts = useSelector((state) => state.posts.posts);

  const formatTimeDifference = (createdAt) => {
    const now = new Date();
    const postDate = new Date(createdAt);

    const diffInSeconds = Math.floor((now - postDate) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays < 2) {
      if (diffInMinutes < 60) {
        return `${diffInMinutes}m ago`;
      } else if (diffInHours < 24) {
        return `${diffInHours}h ago`;
      } else {
        return `${diffInDays}d ago`;
      }
    } else {
      const currentYear = now.getFullYear();
      const postYear = postDate.getFullYear();
      const options = { month: "short", day: "numeric" };

      if (postYear === currentYear) {
        return postDate.toLocaleDateString(undefined, options);
      } else {
        return postDate.toLocaleDateString(undefined, {
          ...options,
          year: "numeric",
        });
      }
    }
  };

  if (!posts || posts.length === 0) {
    return <p>No posts available yet!</p>;
  }

  return (
    <div className="posts-container">
      {posts.map((post, index) => (
        <div key={index} className="post-item">
          <h2 className="post-header">{post.username}</h2>
          <h6 className="post-content">{post.content}</h6>
          {post.mediaUrl && (
            <div className="post-media">
              {post.mediaUrl.endsWith(".mp4") ? (
                <video src={post.mediaUrl} controls className="media-video" />
              ) : (
                <img
                  src={post.mediaUrl}
                  alt="Post media"
                  className="media-img"
                />
              )}
            </div>
          )}
          <div className="post-meta">
            <span className="post-date">
              {formatTimeDifference(post.createdAt)}
            </span>
            <span className="post-likes">{post.likes} Likes</span>
          </div>
          <div className="post-actions">
            <FaComment className="post-icon" title="Comment" />
            <FaHeart className="post-icon" title="Like" />
            <FaShareAlt className="post-icon" title="Share" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Posts;
