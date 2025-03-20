import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { usersApi } from "../../api";
import { User, PaginatedResponse } from "../../api/types";
import { handleApiError } from "../../utils/apiUtils";
import { RejectedAction } from "../types";

interface UsersState {
  users: User[];
  currentUser: User | null;
  totalPages: number;
  currentPage: number;
  loading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  users: [],
  currentUser: null,
  totalPages: 0,
  currentPage: 0,
  loading: false,
  error: null,
};

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (
    { page = 0, size = 10 }: { page?: number; size?: number },
    { rejectWithValue }
  ) => {
    try {
      return await usersApi.getAll(page, size);
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const fetchUserById = createAsyncThunk(
  "users/fetchUserById",
  async (id: number, { rejectWithValue }) => {
    try {
      return await usersApi.getById(id);
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const updateUser = createAsyncThunk(
  "users/updateUser",
  async (
    { id, user }: { id: number; user: Partial<User> },
    { rejectWithValue }
  ) => {
    try {
      return await usersApi.update(id, user);
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (id: number, { rejectWithValue }) => {
    try {
      await usersApi.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const updateUserAvatar = createAsyncThunk(
  "users/updateUserAvatar",
  async ({ id, avatar }: { id: number; avatar: File }, { rejectWithValue }) => {
    try {
      return await usersApi.updateAvatar(id, avatar);
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const searchUsers = createAsyncThunk(
  "users/searchUsers",
  async (
    {
      query,
      page = 0,
      size = 10,
    }: { query: string; page?: number; size?: number },
    { rejectWithValue }
  ) => {
    try {
      return await usersApi.search(query, page, size);
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentUser: (state) => {
      state.currentUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.content;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.number;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action as RejectedAction).payload?.message ||
          "Failed to fetch users";
      })
      // Fetch User By Id
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action as RejectedAction).payload?.message || "Failed to fetch user";
      })
      // Update User
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.users.findIndex(
          (user) => user.id === action.payload.id
        );
        if (index !== -1) {
          state.users[index] = action.payload;
        }
        if (state.currentUser?.id === action.payload.id) {
          state.currentUser = action.payload;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action as RejectedAction).payload?.message ||
          "Failed to update user";
      })
      // Delete User
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter((user) => user.id !== action.payload);
        if (state.currentUser?.id === action.payload) {
          state.currentUser = null;
        }
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action as RejectedAction).payload?.message ||
          "Failed to delete user";
      })
      // Update User Avatar
      .addCase(updateUserAvatar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserAvatar.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.users.findIndex(
          (user) => user.id === action.payload.id
        );
        if (index !== -1) {
          state.users[index] = action.payload;
        }
        if (state.currentUser?.id === action.payload.id) {
          state.currentUser = action.payload;
        }
      })
      .addCase(updateUserAvatar.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action as RejectedAction).payload?.message ||
          "Failed to update user avatar";
      })
      // Search Users
      .addCase(searchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.content;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.number;
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action as RejectedAction).payload?.message ||
          "Failed to search users";
      });
  },
});

export const { clearError, clearCurrentUser } = usersSlice.actions;
export default usersSlice.reducer;
