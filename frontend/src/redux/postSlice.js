import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../api/axios"; // Your axios config

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
  async ({ content, media }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("content", content);
      if (media) {
        formData.append("media", media); // Add media to the FormData
      }

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

const initialState = {
  posts: [],
  status: "idle", // idle, loading, succeeded, failed
  error: null,
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
        state.posts = action.payload;
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
        state.posts.unshift(action.payload); // Add the new post to the front of the list
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
      });
  },
});

export default postSlice.reducer;
