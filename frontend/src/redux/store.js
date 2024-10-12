import { configureStore } from "@reduxjs/toolkit";
import authReducer, { tokenMiddleware } from "./authSlice";
import userReducer from "./userSlice";
import postReducer from "./postSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    posts: postReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(tokenMiddleware),
});

export default store;
