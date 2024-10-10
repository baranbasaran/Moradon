import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice"; // Auth slice for login/logout
import userReducer from "./userSlice"; // User slice for profile

export const store = configureStore({
  reducer: {
    auth: authReducer, // Attach auth slice to the store
    user: userReducer, // Attach user slice to the store
  },
});

export default store;
