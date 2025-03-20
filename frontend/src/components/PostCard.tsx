import React, { useCallback, useMemo, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { Post } from "../api/types";
import { likePost, unlikePost } from "../redux/slices/postsSlice";
import { generateAvatar } from "../utils/avatarUtils";
import { FaHeart, FaRegHeart, FaComment, FaShare } from "react-icons/fa";

interface PostCardProps {
  post: Post;
}

// Memoized selector to prevent unnecessary re-renders
const selectCurrentUserId = (state: RootState) => state.auth.user?.id;

const PostCard: React.FC<PostCardProps> = React.memo(
  ({ post }) => {
    const dispatch = useDispatch<AppDispatch>();
    const renderCount = useRef(0);

    // Get current user ID from Redux store using memoized selector
    const currentUserId = useSelector(selectCurrentUserId);

    // Check if the post is liked by the current user
    const isLiked = useMemo(() => {
      if (!currentUserId || !post.likedBy) return false;
      return post.likedBy.includes(currentUserId);
    }, [currentUserId, post.likedBy]);

    // Memoize user data calculations
    const { username, avatarUrl } = useMemo(() => {
      const username = post.user?.username || "Anonymous";
      const avatarUrl = post.user
        ? generateAvatar(post.user.username)
        : generateAvatar("anonymous");
      return { username, avatarUrl };
    }, [post.user]);

    const handleLike = useCallback(async () => {
      if (!currentUserId) return; // Don't allow liking if not logged in

      try {
        if (isLiked) {
          await dispatch(unlikePost(post.id)).unwrap();
        } else {
          await dispatch(likePost(post.id)).unwrap();
        }
      } catch (error) {
        console.error("[PostCard] Error toggling like:", error);
      }
    }, [dispatch, isLiked, post.id, currentUserId]);

    // Memoize the post content section
    const postContent = useMemo(
      () => (
        <div className="mb-4">
          {post.title && (
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              {post.title}
            </h2>
          )}
          <p className="text-gray-600 dark:text-gray-300">{post.content}</p>
        </div>
      ),
      [post.title, post.content]
    );

    // Memoize the book reference section
    const bookReference = useMemo(() => {
      if (!post.book) return null;
      return (
        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h4 className="font-medium text-gray-800 dark:text-white mb-1">
            {post.book.title}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            by {post.book.author}
          </p>
        </div>
      );
    }, [post.book]);

    // Memoize the post actions section
    const postActions = useMemo(
      () => (
        <div className="flex items-center space-x-6">
          <button
            onClick={handleLike}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
          >
            {isLiked ? (
              <FaHeart className="text-red-500" />
            ) : (
              <FaRegHeart className="text-gray-400" />
            )}
            <span>{post.likes || 0}</span>
          </button>
          <button className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
            <FaComment />
            <span>{post.comments?.length || 0}</span>
          </button>
          <button className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
            <FaShare />
          </button>
        </div>
      ),
      [handleLike, isLiked, post.likes, post.comments?.length]
    );

    // Track re-renders with dependencies
    useEffect(() => {
      renderCount.current += 1;
      console.log(
        `[PostCard ${post.id}] Re-render #${renderCount.current} triggered by:`,
        {
          postId: post.id,
          content: post.content,
          likes: post.likes,
          likedBy: post.likedBy,
          renderCount: renderCount.current,
        }
      );
    }, [post.id, post.content, post.likes, post.likedBy]);

    // Memoize the entire card content
    const cardContent = useMemo(
      () => (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          {/* Post Header */}
          <div className="flex items-center space-x-3 mb-4">
            <img
              src={avatarUrl}
              alt={username}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-white">
                {username}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Post Content */}
          {postContent}

          {/* Book Reference */}
          {bookReference}

          {/* Post Actions */}
          {postActions}
        </div>
      ),
      [
        avatarUrl,
        username,
        post.createdAt,
        postContent,
        bookReference,
        postActions,
      ]
    );

    return cardContent;
  },
  // Custom comparison function for React.memo
  (prevProps, nextProps) => {
    // Only re-render if specific properties have changed
    return (
      prevProps.post.id === nextProps.post.id &&
      prevProps.post.content === nextProps.post.content &&
      prevProps.post.likes === nextProps.post.likes &&
      prevProps.post.likedBy === nextProps.post.likedBy &&
      prevProps.post.comments?.length === nextProps.post.comments?.length
    );
  }
);

PostCard.displayName = "PostCard";

export default PostCard;
