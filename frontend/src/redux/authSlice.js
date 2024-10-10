import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../api/axios"; // Your axios config

export const signup = createAsyncThunk(
  "auth/signup",
  async (
    { email, password, name, username, birthDate },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.post("/v1/auth/signup", {
        email,
        password,
        name,
        username,
        birthDate,
      });

      localStorage.setItem("token", response.data);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Asynchronous action to handle login
export const login = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/v1/auth/login", {
        email,
        password,
      });

      // Save token in localStorage or cookies
      localStorage.setItem("token", response.data);

      // Return the user data or token to the store
      return response.data;
    } catch (error) {
      // Handle error if login fails
      return rejectWithValue(error.response.data);
    }
  }
);

// Asynchronous action to handle logout if necessary
// Optional: you might handle logout only on the client side, so this action is optional.

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: localStorage.getItem("token") || null,
    isAuthenticated: !!localStorage.getItem("token"), // Set to true if token exists
    status: "idle", // idle, loading, succeeded, failed
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token"); // Clear token from localStorage
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
      })
      .addCase(signup.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(signup.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
