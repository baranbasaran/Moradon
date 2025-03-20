import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { commentsApi } from "../../api";
import { Comment, PaginatedResponse } from "../../api/types";
import { handleApiError } from "../../utils/apiUtils";
import { RejectedAction } from "../types";

interface CommentsState {
  comments: Comment[];
  currentComment: Comment | null;
  totalPages: number;
  currentPage: number;
  loading: boolean;
  error: string | null;
}

const initialState: CommentsState = {
  comments: [],
  currentComment: null,
  totalPages: 0,
  currentPage: 0,
  loading: false,
  error: null,
};

export const fetchComments = createAsyncThunk(
  "comments/fetchComments",
  async (
    {
      postId,
      page = 0,
      size = 10,
    }: { postId: number; page?: number; size?: number },
    { rejectWithValue }
  ) => {
    try {
      return await commentsApi.getAll(postId, page, size);
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const fetchCommentById = createAsyncThunk(
  "comments/fetchCommentById",
  async (id: number, { rejectWithValue }) => {
    try {
      return await commentsApi.getById(id);
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const createComment = createAsyncThunk(
  "comments/createComment",
  async (
    comment: Omit<Comment, "id" | "createdAt" | "updatedAt" | "user">,
    { rejectWithValue }
  ) => {
    try {
      return await commentsApi.create(comment);
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const updateComment = createAsyncThunk(
  "comments/updateComment",
  async (
    { id, comment }: { id: number; comment: Partial<Comment> },
    { rejectWithValue }
  ) => {
    try {
      return await commentsApi.update(id, comment);
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const deleteComment = createAsyncThunk(
  "comments/deleteComment",
  async (id: number, { rejectWithValue }) => {
    try {
      await commentsApi.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const fetchUserComments = createAsyncThunk(
  "comments/fetchUserComments",
  async (
    {
      userId,
      page = 0,
      size = 10,
    }: { userId: number; page?: number; size?: number },
    { rejectWithValue }
  ) => {
    try {
      return await commentsApi.getUserComments(userId, page, size);
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentComment: (state) => {
      state.currentComment = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Comments
      .addCase(fetchComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload.content;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.number;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action as RejectedAction).payload?.message ||
          "Failed to fetch comments";
      })
      // Fetch Comment By Id
      .addCase(fetchCommentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCommentById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentComment = action.payload;
      })
      .addCase(fetchCommentById.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action as RejectedAction).payload?.message ||
          "Failed to fetch comment";
      })
      // Create Comment
      .addCase(createComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.loading = false;
        state.comments.unshift(action.payload);
      })
      .addCase(createComment.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action as RejectedAction).payload?.message ||
          "Failed to create comment";
      })
      // Update Comment
      .addCase(updateComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.comments.findIndex(
          (comment) => comment.id === action.payload.id
        );
        if (index !== -1) {
          state.comments[index] = action.payload;
        }
        if (state.currentComment?.id === action.payload.id) {
          state.currentComment = action.payload;
        }
      })
      .addCase(updateComment.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action as RejectedAction).payload?.message ||
          "Failed to update comment";
      })
      // Delete Comment
      .addCase(deleteComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = state.comments.filter(
          (comment) => comment.id !== action.payload
        );
        if (state.currentComment?.id === action.payload) {
          state.currentComment = null;
        }
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action as RejectedAction).payload?.message ||
          "Failed to delete comment";
      })
      // Fetch User Comments
      .addCase(fetchUserComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserComments.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload.content;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.number;
      })
      .addCase(fetchUserComments.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action as RejectedAction).payload?.message ||
          "Failed to fetch user comments";
      });
  },
});

export const { clearError, clearCurrentComment } = commentsSlice.actions;
export default commentsSlice.reducer;
