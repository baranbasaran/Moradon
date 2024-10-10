import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../api/axios"; // Your axios config

export const fetchUserProfile = createAsyncThunk(
  "user/fetchUserProfile",
  async (userId) => {
    const response = await apiClient.get(`users/${userId}`);
    return response.data.data; // Adjust according to your actual API response structure
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    profile: null,
    status: "idle",
    error: null,
  },
  reducers: {
    // Reducers can be added here if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default userSlice.reducer;
