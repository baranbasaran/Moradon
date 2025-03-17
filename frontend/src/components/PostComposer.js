import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../styles/PostComposer.css";
import { addPost } from "../redux/postSlice";
import { generateRandomAvatar } from "../utils/avatarUtils";

const PostComposer = () => {
  const [content, setContent] = useState("");
  const [mediaFile, setMediaFile] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("");
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    // Generate a random avatar URL when component mounts
    setAvatarUrl(generateRandomAvatar());
  }, []);

  const handlePost = () => {
    if (content.trim()) {
      const formData = new FormData();
      formData.append("content", content);
      formData.append("avatarUrl", avatarUrl);
      if (mediaFile) {
        formData.append("mediaFile", mediaFile);
      }
      dispatch(addPost({ content, mediaFile, avatarUrl }));
      setContent("");
      setMediaFile(null);
      // Generate a new avatar for the next post
      setAvatarUrl(generateRandomAvatar());
    }
  };

  return (
    <div className="post-composer">
      <div className="post-composer-header">
        <img src={avatarUrl} alt="Your avatar" className="post-avatar" />
        <textarea
          placeholder="What's happening?"
          rows="3"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      <div className="post-composer-actions">
        <div className="media-buttons">
          <button>
            <i className="fas fa-image"></i>
          </button>
          <button onClick={() => setAvatarUrl(generateRandomAvatar())}>
            <i className="fas fa-random"></i>
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
