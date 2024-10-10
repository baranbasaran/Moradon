// UserProfilePosts.js
import React from "react";
import PropTypes from "prop-types";
import "../styles/Posts.css";

const Posts = ({ posts }) => {
  return (
    <div className="user-posts">
      <h3>Posts</h3>
      {posts.map((post, index) => (
        <div key={index} className="post">
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  );
};

Posts.propTypes = {
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      content: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default Posts;
