import React, { useState } from "react";
import "../styles/PostComposer.css";

const PostComposer = () => {
  const [postContent, setPostContent] = useState("");

  const handlePost = () => {
    console.log(postContent);
    setPostContent("");
  };

  return (
    <div className="post-composer">
      <textarea
        placeholder="What's happening?"
        rows="3"
        value={postContent}
        onChange={(e) => setPostContent(e.target.value)}
      />
      <div className="post-composer-actions">
        <div className="media-buttons">
          <button>
            <i className="fas fa-image"></i>
          </button>
          <button>
            <i className="fas fa-gift"></i>
          </button>
          <button>
            <i className="fas fa-smile"></i>
          </button>
        </div>
        <button
          className="post-button"
          disabled={!postContent.trim()}
          onClick={handlePost}
        >
          Post
        </button>
      </div>
    </div>
  );
};

export default PostComposer;
