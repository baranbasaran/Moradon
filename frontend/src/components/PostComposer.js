import React, { useState } from "react";
import { useDispatch } from "react-redux";
import "../styles/PostComposer.css";
import { addPost } from "../redux/postSlice";

const PostComposer = () => {
  const [content, setContent] = useState("");
  const [mediaFile, setMediaFile] = useState(null); // State to hold the media file
  const dispatch = useDispatch();

  const handlePost = () => {
    if (content.trim()) {
      const formData = new FormData();
      formData.append("content", content);
      if (mediaFile) {
        formData.append("mediaFile", mediaFile); // Update key to 'mediaFile'
      }
      dispatch(addPost({ content, mediaFile }));
      setContent("");
      setMediaFile(null);
    }
  };

  return (
    <div className="post-composer">
      <textarea
        placeholder="What's happening?"
        rows="3"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <input
        type="file"
        accept="image/*,video/*"
        onChange={(e) => setMediaFile(e.target.files[0])}
      />
      <div className="post-composer-actions">
        <div className="media-buttons">
          <button>
            <i className="fas fa-image"></i>
          </button>
        </div>
        <button
          className="post-button"
          disabled={!content.trim()}
          onClick={handlePost}
        >
          Post
        </button>
      </div>
    </div>
  );
};

export default PostComposer;
