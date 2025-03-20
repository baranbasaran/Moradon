import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { postsApi, CreatePostRequest } from "../../api/posts";
import { Post, PaginatedResponse } from "../../api/types";
import { handleApiError } from "../../utils/apiUtils";
import { RejectedAction } from "../types";

interface PostsState {
  posts: Post[];
  currentPost: Post | null;
  totalPages: number;
  currentPage: number;
  loading: boolean;
  error: string | null;
}

const initialState: PostsState = {
  posts: [],
  currentPost: null,
  totalPages: 0,
  currentPage: 0,
  loading: false,
  error: null,
};

export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (
    { page = 0, size = 10 }: { page?: number; size?: number },
    { rejectWithValue }
  ) => {
    try {
      return await postsApi.getAll(page, size);
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const fetchPostById = createAsyncThunk(
  "posts/fetchPostById",
  async (id: number, { rejectWithValue }) => {
    try {
      return await postsApi.getById(id);
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const createPost = createAsyncThunk(
  "posts/createPost",
  async (post: CreatePostRequest, { rejectWithValue }) => {
    try {
      return await postsApi.create(post);
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async (
    { id, post }: { id: number; post: Partial<Post> },
    { rejectWithValue }
  ) => {
    try {
      return await postsApi.update(id, post);
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (id: number, { rejectWithValue }) => {
    try {
      await postsApi.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const likePost = createAsyncThunk(
  "posts/likePost",
  async (id: number, { rejectWithValue }) => {
    try {
      return await postsApi.like(id);
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const unlikePost = createAsyncThunk(
  "posts/unlikePost",
  async (id: number, { rejectWithValue }) => {
    try {
      return await postsApi.unlike(id);
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const fetchUserPosts = createAsyncThunk(
  "posts/fetchUserPosts",
  async (
    {
      userId,
      page = 0,
      size = 10,
    }: { userId: number; page?: number; size?: number },
    { rejectWithValue }
  ) => {
    try {
      return await postsApi.getUserPosts(userId, page, size);
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentPost: (state) => {
      state.currentPost = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Posts
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload.content;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.number;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action as RejectedAction).payload?.message ||
          "Failed to fetch posts";
      })
      // Fetch Post By Id
      .addCase(fetchPostById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPostById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPost = action.payload;
      })
      .addCase(fetchPostById.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action as RejectedAction).payload?.message || "Failed to fetch post";
      })
      // Create Post
      .addCase(createPost.pending, (state) => {
        console.log("createPost.pending");
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        console.log("createPost.fulfilled:", action.payload);
        state.loading = false;
        if (!state.posts) {
          state.posts = [];
        }
        state.posts.unshift(action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        console.log("createPost.rejected:", action);
        state.loading = false;
        state.error =
          (action as RejectedAction).payload?.message ||
          "Failed to create post";
      })
      // Update Post
      .addCase(updatePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.posts.findIndex(
          (post) => post.id === action.payload.id
        );
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
        if (state.currentPost?.id === action.payload.id) {
          state.currentPost = action.payload;
        }
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action as RejectedAction).payload?.message ||
          "Failed to update post";
      })
      // Delete Post
      .addCase(deletePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = state.posts.filter((post) => post.id !== action.payload);
        if (state.currentPost?.id === action.payload) {
          state.currentPost = null;
        }
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action as RejectedAction).payload?.message ||
          "Failed to delete post";
      })
      // Like Post
      .addCase(likePost.fulfilled, (state, action) => {
        const index = state.posts.findIndex(
          (post) => post.id === action.payload.id
        );
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
        if (state.currentPost?.id === action.payload.id) {
          state.currentPost = action.payload;
        }
      })
      // Unlike Post
      .addCase(unlikePost.fulfilled, (state, action) => {
        const index = state.posts.findIndex(
          (post) => post.id === action.payload.id
        );
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
        if (state.currentPost?.id === action.payload.id) {
          state.currentPost = action.payload;
        }
      })
      // Fetch User Posts
      .addCase(fetchUserPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload.content;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.number;
      })
      .addCase(fetchUserPosts.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action as RejectedAction).payload?.message ||
          "Failed to fetch user posts";
      });
  },
});

export const { clearError, clearCurrentPost } = postsSlice.actions;
export default postsSlice.reducer;
