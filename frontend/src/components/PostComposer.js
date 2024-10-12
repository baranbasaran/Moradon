import React, { useState } from "react";
import { useDispatch } from "react-redux";
import "../styles/PostComposer.css";
import { addPost } from "../redux/postSlice"; // Import the action

const PostComposer = () => {
  const [postContent, setPostContent] = useState("");
  const [media, setMedia] = useState(null); // State to hold the media file
  const dispatch = useDispatch();

  const handlePost = () => {
    if (postContent.trim()) {
      const formData = new FormData();
      formData.append("content", postContent);
      if (media) {
        formData.append("media", media); // Attach media to the post
      }
      dispatch(addPost(formData)); // Send formData instead of a simple object
      setPostContent("");
      setMedia(null); // Reset media state
    }
  };

  return (
    <div className="post-composer">
      <textarea
        placeholder="What's happening?"
        rows="3"
        value={postContent}
        onChange={(e) => setPostContent(e.target.value)}
      />
      <input
        type="file"
        accept="image/*,video/*"
        onChange={(e) => setMedia(e.target.files[0])} // Handle file input
      />
      <div className="post-composer-actions">
        <div className="media-buttons">
          <button>
            <i className="fas fa-image"></i>
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
