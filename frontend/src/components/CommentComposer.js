import React, { useEffect, useRef, useState } from "react";
import "../styles/CommentComposer.css";

const CommentComposer = ({ selectedPost, onSubmit, onClose }) => {
  const [commentText, setCommentText] = useState("");
  const contentRef = useRef(null);
  const separatorRef = useRef(null);

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

  useEffect(() => {
    if (contentRef.current && separatorRef.current) {
      separatorRef.current.style.height = `${contentRef.current.offsetHeight}px`;
    }
  }, [selectedPost]);

  if (!selectedPost) return null;

  return (
    <div className="comment-composer-modal">
      <div className="comment-composer-receiver">
        <div className="comment-composer-header">
          <div className="comment-composer-avatar-container">
            <img
              src={selectedPost.avatarUrl}
              alt="Avatar"
              className="comment-composer-avatar"
            />
          </div>
          <div className="comment-composer-details">
            <div className="comment-composer-name">Baran Başaran</div>
            <div className="comment-composer-username">
              @{selectedPost.username}
            </div>
            <span className="post-time">
              {formatTimeDifference(selectedPost.createdAt)}
            </span>
          </div>
        </div>

        <div className="comment-composer-content-container">
          <div className="comment-composer-separator" ref={separatorRef}></div>
          <div className="comment-composer-post" ref={contentRef}>
            <div className="comment-composer-content">
              {selectedPost.content}
            </div>
          </div>
        </div>
      </div>

      <div className="comment-composer-sender">
        <div className="comment-composer-avatar-container">
          <img
            src={selectedPost.avatarUrl} // FOR TESTING PURPOSES
            alt="Avatar"
            className="comment-composer-avatar"
          />
        </div>
        <div className="comment-composer-input">
          <textarea
            className="comment-composer-textarea"
            placeholder="Add another post"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          ></textarea>
        </div>
      </div>

      <div className="comment-composer-footer">
        <div className="comment-composer-buttons">
          <button className="comment-composer-cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            className="comment-composer-submit"
            onClick={() => onSubmit(commentText)}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentComposer;
