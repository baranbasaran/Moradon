import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { 
  FaComment, 
  FaHeart, 
  FaRetweet, 
  FaBookmark,
  FaReply,
  FaEllipsisH
} from "react-icons/fa";
import { likePost, addComment, fetchComments, repostPost, fetchPosts } from "../redux/postSlice";
import CommentComposer from "./CommentComposer";
import { generateRandomAvatar } from "../utils/avatarUtils";
import { formatTimestamp } from "../utils/dateUtils";
import api from "../api/axiosConfig";
import "../styles/Posts.css";

const Comment = ({ comment, onReply, onLike, onRepost, level = 0 }) => {
  const formatTimeDifference = (createdAt) => {
    const now = new Date();
    const commentDate = new Date(createdAt);
    const diffInMinutes = Math.floor((now - commentDate) / 60000);
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d`;
    return new Date(createdAt).toLocaleDateString();
  };

  return (
    <div className={`comment-item level-${level}`}>
      <div className="comment-content-container">
        <div className="comment-avatar">
          <img src={comment.avatarUrl || generateRandomAvatar()} alt="Avatar" className="avatar" />
        </div>
        <div className="comment-main-content">
          <div className="comment-header">
            <div className="comment-details">
              <span className="comment-name">{comment.username || 'User'}</span>
              <span className="comment-username">@{comment.username || 'user'}</span>
              <span className="comment-time">{formatTimeDifference(comment.createdAt)}</span>
            </div>
            <button className="more-options-btn">
              <FaEllipsisH />
            </button>
          </div>
          {comment.replyingTo && (
            <span className="replying-to">
              Replying to <span className="username">@{comment.replyingTo}</span>
            </span>
          )}
          <div className="comment-text">{comment.content}</div>
          {comment.mediaUrls && comment.mediaUrls.length > 0 && (
            <div className={`comment-media grid-${Math.min(comment.mediaUrls.length, 4)}`}>
              {comment.mediaUrls.map((url, index) => (
                url.endsWith('.mp4') ? (
                  <video key={index} src={url} controls className="media-item" />
                ) : (
                  <img key={index} src={url} alt="" className="media-item" />
                )
              ))}
            </div>
          )}
          <div className="comment-actions">
            <div className="comment-action-item" onClick={() => onReply(comment)}>
              <FaComment className="comment-icon" />
              <span className="action-count">{comment.replies?.length || 0}</span>
            </div>
            <div className="comment-action-item repost" onClick={() => onRepost(comment)}>
              <FaRetweet className="comment-icon" />
              <span className="action-count">{comment.reposts || 0}</span>
            </div>
            <div className="comment-action-item like" onClick={() => onLike(comment.id)}>
              <FaHeart className={`comment-icon ${comment.liked ? 'liked' : ''}`} />
              <span className="action-count">{comment.likes || 0}</span>
            </div>
            <div className="comment-action-item">
              <FaBookmark className="comment-icon" />
            </div>
          </div>
        </div>
      </div>
      {comment.replies && comment.replies.length > 0 && (
        <div className="comment-replies">
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

const Posts = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Redux state
  const posts = useSelector((state) => state.posts.posts);
  const reduxComments = useSelector((state) => state.posts.comments);
  const { user: currentUser, isAuthenticated, token } = useSelector((state) => state.auth);
  const postsStatus = useSelector((state) => state.posts.status);
  
  // Local state
  const [commentComposerOpen, setCommentComposerOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedComment, setSelectedComment] = useState(null);
  const [sortBy, setSortBy] = useState("latest");
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [error, setError] = useState(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth/sign-in');
    }
  }, [isAuthenticated, navigate]);

  // Fetch posts if needed
  useEffect(() => {
    if (postsStatus === 'idle' && isAuthenticated) {
      dispatch(fetchPosts());
    }
  }, [postsStatus, dispatch, isAuthenticated]);

  const handlePostClick = async (postId) => {
    // Check authentication
    if (!isAuthenticated || !token) {
      setError('Please sign in to view comments');
      navigate('/auth/sign-in');
      return;
    }

    // Toggle expanded state
    if (expandedPostId === postId) {
      setExpandedPostId(null);
      return;
    }
    
    setExpandedPostId(postId);
    setIsLoadingComments(true);
    setError(null);
    
    try {
      // Dispatch action to fetch comments
      await dispatch(fetchComments(postId)).unwrap();
    } catch (error) {
      console.error('Error fetching comments:', error);
      
      // Handle authentication errors
      if (error?.status === 401 || error?.status === 403) {
        setError('Please sign in to view comments');
        navigate('/auth/sign-in');
      } else {
        setError('Failed to load comments. Please try again later.');
      }
    } finally {
      setIsLoadingComments(false);
    }
  };

  const handleLike = (postId) => {
    dispatch(likePost(postId));
  };

  const handleRepost = (post) => {
    dispatch(repostPost(post.id));
  };

  const handleComment = (post) => {
    setSelectedPost({ ...post, avatarUrl: generateRandomAvatar() });
    setSelectedComment(null);
    setCommentComposerOpen(true);
  };

  const handleReply = (comment) => {
    setSelectedComment(comment);
    setCommentComposerOpen(true);
  };

  const submitComment = (commentText, parentCommentId = null) => {
    if (selectedPost) {
      dispatch(
        addComment({
          postId: selectedPost.id,
          commentText,
          userId: currentUser.id,
          parentCommentId,
          replyingTo: selectedComment?.username
        })
      );
      setCommentComposerOpen(false);
      setSelectedComment(null);
    }
  };

  const getSortedComments = (postComments) => {
    if (!postComments) return [];
    const rootComments = postComments.filter(comment => !comment.parentCommentId);
    
    switch (sortBy) {
      case "top":
        return rootComments.sort((a, b) => (b.likes || 0) - (a.likes || 0));
      case "oldest":
        return rootComments.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      case "latest":
      default:
        return rootComments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  };

  if (!posts || posts.length === 0) {
    return <p>No posts available yet!</p>;
  }

  return (
    <div className="posts-container">
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      {posts.map((post) => (
        <div key={post.id} className="post-item">
          <div 
            className="post-content-container"
            onClick={() => handlePostClick(post.id)}
            role="button"
            tabIndex={0}
          >
            <div className="post-header">
              <img 
                src={post.avatarUrl || generateRandomAvatar()} 
                alt="User avatar" 
                className="avatar"
              />
              <div className="post-details">
                <span className="post-name">{post.username}</span>
                <span className="post-time">{formatTimestamp(post.createdAt)}</span>
              </div>
            </div>
            <div className="post-content">{post.content}</div>
            {post.mediaUrl && (
              <div className="post-media">
                <img src={post.mediaUrl} alt="Post media" />
              </div>
            )}
            <div className="post-actions">
              <button 
                className="action-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleComment(post);
                }}
              >
                <FaComment /> {post.commentCount || 0}
              </button>
              <button 
                className="action-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRepost(post);
                }}
              >
                <FaRetweet /> {post.repostCount || 0}
              </button>
              <button 
                className="action-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike(post.id);
                }}
              >
                <FaHeart /> {post.likeCount || 0}
              </button>
              <button className="action-button">
                <FaBookmark />
              </button>
            </div>
          </div>
          
          {/* Comments Section */}
          {expandedPostId === post.id && (
            <div className="comments-section">
              {isLoadingComments ? (
                <div className="loading-spinner">
                  <div className="spinner"></div>
                  <p>Loading comments...</p>
                </div>
              ) : error ? (
                <div className="error-message">
                  {error}
                  <button onClick={() => handlePostClick(post.id)}>Try Again</button>
                </div>
              ) : (
                <>
                  <CommentComposer 
                    postId={post.id} 
                    onCommentAdded={(newComment) => {
                      dispatch(addComment({
                        postId: post.id,
                        commentText: newComment.content,
                        userId: currentUser?.id
                      }));
                    }} 
                  />
                  <div className="comments-list">
                    {!reduxComments[post.id] || reduxComments[post.id].length === 0 ? (
                      <p className="no-comments">No comments yet. Be the first to comment!</p>
                    ) : (
                      getSortedComments(reduxComments[post.id]).map((comment) => (
                        <Comment 
                          key={comment.id} 
                          comment={comment}
                          onReply={handleReply}
                          onLike={() => {/* Handle like */}}
                          onRepost={() => {/* Handle repost */}}
                        />
                      ))
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      ))}
      
      {commentComposerOpen && selectedPost && (
        <div className="modal-backdrop">
          <div className="comment-modal">
            <div className="modal-header">
              <h3>{selectedComment ? "Reply to Comment" : "Add Comment"}</h3>
              <button className="close-button" onClick={() => setCommentComposerOpen(false)}>×</button>
            </div>
            <div className="modal-content">
              <div className="original-post">
                <img src={selectedPost.avatarUrl} alt="User avatar" className="avatar" />
                <div className="post-content">
                  <div className="post-header">
                    <span className="post-name">{selectedPost.username}</span>
                    <span className="post-time">{formatTimestamp(selectedPost.createdAt)}</span>
                  </div>
                  <p>{selectedPost.content}</p>
                </div>
              </div>
              
              {selectedComment && (
                <div className="original-comment">
                  <img src={generateRandomAvatar()} alt="Commenter avatar" className="avatar" />
                  <div className="comment-content">
                    <div className="comment-header">
                      <span className="comment-name">{selectedComment.username}</span>
                      <span className="comment-time">{formatTimestamp(selectedComment.createdAt)}</span>
                    </div>
                    <p>{selectedComment.content}</p>
                  </div>
                </div>
              )}
              
              <CommentComposer 
                postId={selectedPost.id}
                parentCommentId={selectedComment?.id}
                onCommentAdded={(newComment) => {
                  submitComment(newComment.content, selectedComment?.id);
                  setCommentComposerOpen(false);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Posts;
