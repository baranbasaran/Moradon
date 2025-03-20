import React from "react";
import { FaComment, FaHeart, FaRetweet, FaBookmark } from "react-icons/fa";
import { generateAvatar, getDefaultAvatar } from "../utils/avatarUtils";
import { formatTimestamp } from "../utils/dateUtils";

interface CommentProps {
  comment: {
    id: string | number;
    content: string;
    username?: string;
    createdAt?: string;
    mediaUrls?: string[];
    replies?: CommentProps["comment"][];
    likes?: number;
    reposts?: number;
    liked?: boolean;
  };
  onReply: (comment: CommentProps["comment"]) => void;
  onLike: (commentId: string | number) => void;
  onRepost: (comment: CommentProps["comment"]) => void;
  level?: number;
}

const Comment: React.FC<CommentProps> = ({
  comment,
  onReply,
  onLike,
  onRepost,
  level = 0,
}) => {
  const avatarUrl = comment.username
    ? generateAvatar(comment.username)
    : getDefaultAvatar();

  return (
    <div className={`relative pl-4 ${level > 0 ? "mt-4" : ""}`}>
      {level > 0 && (
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />
      )}
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <img
            src={avatarUrl}
            alt={`${comment.username || "User"}'s avatar`}
            className="w-10 h-10 rounded-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold text-gray-900 dark:text-white">
              {comment.username || "User"}
            </span>
            <span className="text-gray-500 dark:text-gray-400">
              @{comment.username || "user"}
            </span>
            <span className="text-gray-500 dark:text-gray-400">
              {comment.createdAt
                ? formatTimestamp(comment.createdAt)
                : "Just now"}
            </span>
          </div>
          <div className="mt-1 text-gray-900 dark:text-white whitespace-pre-wrap">
            {comment.content}
          </div>
          {comment.mediaUrls && comment.mediaUrls.length > 0 && (
            <div className="mt-2 grid grid-cols-2 gap-2">
              {comment.mediaUrls.map((url, index) =>
                url.endsWith(".mp4") ? (
                  <video
                    key={index}
                    src={url}
                    controls
                    className="w-full rounded-lg"
                  />
                ) : (
                  <img
                    key={index}
                    src={url}
                    alt=""
                    className="w-full rounded-lg object-cover"
                    loading="lazy"
                  />
                )
              )}
            </div>
          )}
          <div className="mt-3 flex items-center gap-4">
            <button
              onClick={() => onReply(comment)}
              className="flex items-center gap-1 text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors duration-200"
              title="Reply"
            >
              <FaComment />
              <span>{comment.replies?.length || 0}</span>
            </button>
            <button
              onClick={() => onRepost(comment)}
              className="flex items-center gap-1 text-gray-500 hover:text-green-500 dark:text-gray-400 dark:hover:text-green-500 transition-colors duration-200"
              title="Repost"
            >
              <FaRetweet />
              <span>{comment.reposts || 0}</span>
            </button>
            <button
              onClick={() => onLike(comment.id)}
              className="flex items-center gap-1 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-500 transition-colors duration-200"
              title="Like"
            >
              <FaHeart
                className={`${
                  comment.liked ? "text-red-500 fill-current" : ""
                }`}
              />
              <span>{comment.likes || 0}</span>
            </button>
            <button
              className="flex items-center gap-1 text-gray-500 hover:text-yellow-500 dark:text-gray-400 dark:hover:text-yellow-500 transition-colors duration-200"
              title="Bookmark"
            >
              <FaBookmark />
            </button>
          </div>
        </div>
      </div>
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4 space-y-4">
          {comment.replies.map((reply) => (
            <Comment
              key={reply.id}
              comment={reply}
              onReply={onReply}
              onLike={onLike}
              onRepost={onRepost}
              level={Math.min(level + 1, 3)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Comment;
