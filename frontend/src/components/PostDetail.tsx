import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaComment,
  FaHeart,
  FaRetweet,
  FaBookmark,
  FaImage,
  FaSmile,
  FaCalendar,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { formatTimestamp } from "../utils/dateUtils";
import { Post } from "../redux/types";

interface Reply extends Omit<Post, "currentUserAvatar"> {
  replies?: Reply[];
}

interface PostDetailProps {
  post: Post;
  onReply: (reply: string | Reply) => void;
  onLike: (id: string) => void;
  onRepost: (post: Post | Reply) => void;
}

const PostDetail: React.FC<PostDetailProps> = ({
  post,
  onReply,
  onLike,
  onRepost,
}) => {
  const navigate = useNavigate();
  const [replyContent, setReplyContent] = useState("");
  const [showReplyForm, setShowReplyForm] = useState(false);

  const handleReply = () => {
    if (replyContent.trim()) {
      onReply(replyContent);
      setReplyContent("");
      setShowReplyForm(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        >
          <FaArrowLeft />
        </button>
      </div>
      <div className="p-4">
        <div className="flex items-start space-x-4">
          <img
            src={post.currentUserAvatar || post.author.avatarUrl}
            alt={post.author.username}
            className="w-12 h-12 rounded-full"
          />
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-gray-900 dark:text-white">
                {post.author.username}
              </span>
              <span className="text-gray-500 dark:text-gray-400">
                {formatTimestamp(post.createdAt)}
              </span>
            </div>
            <p className="mt-2 text-gray-900 dark:text-white">{post.content}</p>
            {post.mediaUrls && post.mediaUrls.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-2">
                {post.mediaUrls.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`Media ${index + 1}`}
                    className="rounded-lg"
                  />
                ))}
              </div>
            )}
            <div className="mt-4 flex items-center space-x-6">
              <button
                onClick={() => onLike(post.id)}
                className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400"
              >
                <FaHeart />
                <span>{post.likes}</span>
              </button>
              <button
                onClick={() => onRepost(post)}
                className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400"
              >
                <FaRetweet />
                <span>{post.reposts || 0}</span>
              </button>
              <button
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400"
              >
                <FaComment />
                <span>{post.comments.length}</span>
              </button>
              {post.views && (
                <span className="text-gray-500 dark:text-gray-400">
                  {post.views} views
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      {showReplyForm && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Write a reply..."
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            rows={3}
          />
          <div className="mt-2 flex justify-end space-x-2">
            <button
              onClick={() => setShowReplyForm(false)}
              className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleReply}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600"
            >
              Reply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetail;
