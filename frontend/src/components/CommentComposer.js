import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { addComment } from "../redux/postSlice";
import { generateRandomAvatar } from "../utils/avatarUtils";
import { formatTimestamp } from "../utils/dateUtils";
import { FaImage } from "react-icons/fa";
import "../styles/CommentComposer.css";

const MAX_COMMENT_LENGTH = 280;

const CommentComposer = ({ postId, parentCommentId = null, onCommentAdded }) => {
  const dispatch = useDispatch();
  const [commentText, setCommentText] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  
  const currentUser = useSelector(state => state.auth.user);
  const posts = useSelector(state => state.posts.posts);
  const comments = useSelector(state => state.posts.comments);
  
  const post = posts.find(p => p.id === postId);
  const parentComment = parentCommentId ? 
    comments[postId]?.find(c => c.id === parentCommentId) : 
    null;

  const charactersLeft = MAX_COMMENT_LENGTH - commentText.length;
  const isNearLimit = charactersLeft <= 20;
  const isAtLimit = charactersLeft <= 0;

  useEffect(() => {
    // Generate a random avatar for the comment composer
    setAvatarUrl(generateRandomAvatar());
    
    // Auto-focus the textarea
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!commentText.trim() || !currentUser || isAtLimit) return;

    setIsSubmitting(true);
    try {
      const resultAction = await dispatch(addComment({
        postId,
        commentText: commentText.trim(),
        userId: currentUser.id,
        parentCommentId
      }));
      
      if (addComment.fulfilled.match(resultAction)) {
        // Create a new comment object to pass back
        const newComment = {
          id: Date.now().toString(), // Temporary ID until we get the real one
          content: commentText.trim(),
          userId: currentUser.id,
          username: currentUser.username || 'User',
          createdAt: new Date().toISOString(),
          parentCommentId
        };
        
        onCommentAdded(newComment);
        setCommentText("");
      }
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMediaUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    // This would be implemented to handle file uploads
    console.log("File selected:", e.target.files);
    // You would typically upload the file to your server or process it here
  };

  if (!post) return null;

  return (
    <div className="comment-composer">
      <div className="comment-composer-input-container">
        <img
          src={avatarUrl}
          alt="Your avatar"
          className="comment-avatar"
        />
        <textarea
          ref={textareaRef}
          className="comment-textarea"
          placeholder={parentComment ? `Reply to ${parentComment.username}...` : "Add a comment..."}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey && commentText.trim() && !isAtLimit) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          maxLength={MAX_COMMENT_LENGTH}
          disabled={isSubmitting}
        ></textarea>
      </div>

      <div className="comment-composer-footer">
        <input 
          type="file" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          accept="image/*,video/*" 
          onChange={handleFileChange}
          multiple
        />
        <button 
          className="media-upload-button" 
          onClick={handleMediaUpload}
          type="button"
        >
          <FaImage />
        </button>
        
        <div className="comment-composer-buttons">
          {commentText.length > 0 && (
            <div className={`character-counter ${isNearLimit ? 'limit-near' : ''} ${isAtLimit ? 'limit-reached' : ''}`}>
              {charactersLeft}
            </div>
          )}
          <button
            className="comment-submit-button"
            onClick={handleSubmit}
            disabled={!commentText.trim() || isSubmitting || isAtLimit}
          >
            {isSubmitting ? 'Posting...' : (parentComment ? 'Reply' : 'Comment')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentComposer;
