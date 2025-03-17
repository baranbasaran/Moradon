import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../api/axios";

// Fetch posts
export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/posts");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data || "Error fetching posts");
    }
  }
);

// Add post with media support
export const addPost = createAsyncThunk(
  "posts/addPost",
  async ({ content, mediaFile }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("content", content);
      if (mediaFile) formData.append("media", mediaFile);

      const response = await apiClient.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data || "Error adding post");
    }
  }
);

// Delete post
export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (postId, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/posts/${postId}`);
      return postId;
    } catch (error) {
      return rejectWithValue(error.response.data || "Error deleting post");
    }
  }
);

// Like a post
export const likePost = createAsyncThunk(
  "posts/likePost",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`/posts/${postId}/like`);
      return { postId, likes: response.data.likes };
    } catch (error) {
      return rejectWithValue(error.response.data || "Error liking post");
    }
  }
);

export const addComment = createAsyncThunk(
  "posts/addComment",
  async ({ postId, commentText, userId, parentCommentId = null }, { rejectWithValue }) => {
    try {
      if (!postId || !commentText || !userId) {
        throw new Error("Post ID, comment text, and user ID are required");
      }

      const response = await apiClient.post(`/posts/${postId}/comments`, {
        content: commentText,
        userId: userId,
        postId: postId,
        parentCommentId: parentCommentId,
      });

      return { postId, comments: response.data.comments };
    } catch (error) {
      return rejectWithValue(error.response.data || "Error adding comment");
    }
  }
);

// Add new action for fetching comments
export const fetchComments = createAsyncThunk(
  "posts/fetchComments",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/posts/${postId}/comments`);
      return { postId, comments: response.data };
    } catch (error) {
      return rejectWithValue(error.response.data || "Error fetching comments");
    }
  }
);

// Add repost action
export const repostPost = createAsyncThunk(
  "posts/repostPost",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`/posts/${postId}/repost`);
      return { postId, reposts: response.data.reposts };
    } catch (error) {
      return rejectWithValue(error.response.data || "Error reposting");
    }
  }
);

const initialState = {
  posts: [],
  status: "idle", // idle, loading, succeeded, failed
  error: null,
  comments: {}, // Add comments state to store comments by postId
};

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Posts
      .addCase(fetchPosts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.posts = action.payload.map((post) => ({
          ...post,
          likes: post.likes || 0,
          comments: post.comments || [],
        }));
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })

      // Add Post
      .addCase(addPost.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addPost.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.posts.unshift(action.payload); // Add new post at the top
      })
      .addCase(addPost.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })

      // Delete Post
      .addCase(deletePost.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.posts = state.posts.filter((post) => post.id !== action.payload);
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })

      // Like Post
      .addCase(likePost.fulfilled, (state, action) => {
        const { postId, likes } = action.payload;
        const post = state.posts.find((post) => post.id === postId);
        if (post) post.likes = likes;
      })

      // Add Comment
      .addCase(addComment.fulfilled, (state, action) => {
        const { postId, comments } = action.payload;
        const post = state.posts.find((post) => post.id === postId);
        if (post) {
          post.comments = comments;
          post.commentCount = (post.commentCount || 0) + 1;
        }
        // Update comments in the dedicated comments state
        state.comments[postId] = comments;
      })
      
      // Fetch Comments
      .addCase(fetchComments.fulfilled, (state, action) => {
        const { postId, comments } = action.payload;
        state.comments[postId] = comments;
      })

      // Repost Post
      .addCase(repostPost.fulfilled, (state, action) => {
        const { postId, reposts } = action.payload;
        const post = state.posts.find((post) => post.id === postId);
        if (post) {
          post.reposts = reposts;
          post.reposted = !post.reposted; // Toggle repost status
        }
      })
      .addCase(repostPost.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      });
  },
});

export default postSlice.reducer;
