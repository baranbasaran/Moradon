// authSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../api/axios"; // Your axios config
import { jwtDecode } from "jwt-decode"; // Correct import
import { removeToken, setToken, getToken } from "../api/utils/tokenUtils";

// Token validation function
const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const decoded = jwtDecode(token);
    return decoded.exp * 1000 < Date.now(); // Check if token is expired
  } catch (error) {
    return true; // If token decoding fails, treat it as expired
  }
};

// Initial state
const initialState = {
  user: null,
  token: getToken() || null,
  isAuthenticated: !!getToken(),
  status: "idle", // idle, loading, succeeded, failed
  error: null,
};

// Logout action
export const logout = () => (dispatch) => {
  removeToken();
  dispatch(authSlice.actions.logout());
};

// Signup async action
export const signup = createAsyncThunk(
  "auth/signup",
  async (
    { email, password, name, username, birthDate },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.post("/auth/signup", {
        email,
        password,
        name,
        username,
        birthDate,
      });

      const { token, user } = response.data;
      setToken(token); // Save token to storage

      return { user, token };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Signup failed";
      return rejectWithValue(errorMessage);
    }
  }
);

// Login async action
export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/auth/login", credentials);

      const { token, user } = response.data;
      setToken(token); // Save token to storage

      return { user, token };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Login failed";
      return rejectWithValue(errorMessage);
    }
  }
);

// Create the auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.status = "idle"; // Reset status on logout
      state.error = null; // Clear error on logout
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload; // Error message from rejectWithValue
      })
      // Signup cases
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
        state.error = action.payload; // Error message from rejectWithValue
      });
  },
});

export const { logout: logoutAction } = authSlice.actions;

// Middleware to check token expiration and logout if expired
export const tokenMiddleware = (store) => (next) => (action) => {
  const result = next(action);

  const state = store.getState();
  const token = state.auth.token;

  if (state.auth.isAuthenticated && isTokenExpired(token)) {
    // Prevent infinite loop by checking if we're already processing logout
    if (action.type !== "auth/logout") {
      store.dispatch(logoutAction());
    }
  }

  return result;
};

export default authSlice.reducer;
