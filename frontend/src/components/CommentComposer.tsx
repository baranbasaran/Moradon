import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createComment } from "../redux/slices/commentsSlice";
import { generateAvatar, getDefaultAvatar } from "../utils/avatarUtils";
import { FaImage } from "react-icons/fa";
import ProgressIndicator from "./ProgressIndicator";
import { RootState, AppDispatch } from "../redux/store";

const MAX_COMMENT_LENGTH = 280;

interface CommentComposerProps {
  postId: string | number;
  onCommentAdded?: () => Promise<void>;
  setIsSubmitting?: (isSubmitting: boolean) => void;
  replyingTo?: string | null;
}

const CommentComposer: React.FC<CommentComposerProps> = ({
  postId,
  onCommentAdded,
  setIsSubmitting: setParentIsSubmitting,
  replyingTo = null,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { user: currentUser, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  const avatarUrl = currentUser?.username
    ? generateAvatar(currentUser.username)
    : getDefaultAvatar();

  const charactersLeft = MAX_COMMENT_LENGTH - commentText.length;
  const isNearLimit = charactersLeft <= 20;
  const isAtLimit = charactersLeft <= 0;

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [replyingTo]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!isAuthenticated || !currentUser) {
      navigate("/auth/signin");
      return;
    }

    if (!commentText.trim() || isAtLimit) return;

    setIsSubmitting(true);
    if (setParentIsSubmitting) {
      setParentIsSubmitting(true);
    }

    try {
      await dispatch(
        createComment({
          postId,
          commentText: commentText.trim(),
          userId: currentUser.id,
          replyingTo,
        })
      ).unwrap();

      setCommentText("");
      if (onCommentAdded) {
        await onCommentAdded();
      }
    } catch (error: unknown) {
      console.error("Error posting comment:", error);
      if (
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "status" in error.response &&
        error.response.status === 401
      ) {
        navigate("/auth/signin");
      }
    } finally {
      setTimeout(() => {
        setIsSubmitting(false);
        if (setParentIsSubmitting) {
          setParentIsSubmitting(false);
        }
      }, 500);
    }
  };

  const handleMediaUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("File selected:", e.target.files);
  };

  return (
    <div className="relative">
      <ProgressIndicator
        isLoading={isSubmitting}
        color={["#1d9bf0", "#1a8cd8"]}
        height="2px"
      />
      <div
        className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 ${
          isSubmitting ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        <div className="flex gap-4">
          <img
            src={avatarUrl}
            alt="Your avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1 min-w-0">
            <textarea
              ref={textareaRef}
              className="w-full min-h-[100px] p-2 text-gray-900 dark:text-white bg-transparent border-none focus:outline-none resize-none"
              placeholder={
                replyingTo ? `Reply to @${replyingTo}...` : "Add a comment..."
              }
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
                  !e.shiftKey &&
                  commentText.trim() &&
                  !isAtLimit
                ) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              maxLength={MAX_COMMENT_LENGTH}
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*,video/*"
            onChange={handleFileChange}
            multiple
            disabled={isSubmitting}
          />
          <button
            className="p-2 text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleMediaUpload}
            type="button"
            disabled={isSubmitting}
          >
            <FaImage className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            {commentText.length > 0 && (
              <div
                className={`text-sm ${
                  isNearLimit
                    ? "text-yellow-500"
                    : isAtLimit
                    ? "text-red-500"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {charactersLeft}
              </div>
            )}
            <button
              className="px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200"
              onClick={handleSubmit}
              disabled={!commentText.trim() || isSubmitting || isAtLimit}
            >
              {isSubmitting ? "Posting..." : replyingTo ? "Reply" : "Comment"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentComposer;
