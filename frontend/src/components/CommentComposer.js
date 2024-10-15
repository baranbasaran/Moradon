import React, { useEffect, useRef, useState } from "react";
import "../styles/CommentComposer.css";

const CommentComposer = ({ selectedPost, onSubmit, onClose }) => {
  const [commentText, setCommentText] = useState("");
  const contentRef = useRef(null);
  const separatorRef = useRef(null);

  useEffect(() => {
    // Adjust the separator height dynamically based on the content's height
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

      {/* Footer buttons */}
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
