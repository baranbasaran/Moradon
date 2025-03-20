import { useEffect } from "react";
import { useAppDispatch } from "../redux/hooks";
import { clearError } from "../redux/slices/authSlice";
import { clearError as clearBooksError } from "../redux/slices/booksSlice";
import { clearError as clearPostsError } from "../redux/slices/postsSlice";
import { clearError as clearCommentsError } from "../redux/slices/commentsSlice";
import { clearError as clearUsersError } from "../redux/slices/usersSlice";

export const useApiError = (
  slice: "auth" | "books" | "posts" | "comments" | "users"
) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    return () => {
      switch (slice) {
        case "auth":
          dispatch(clearError());
          break;
        case "books":
          dispatch(clearBooksError());
          break;
        case "posts":
          dispatch(clearPostsError());
          break;
        case "comments":
          dispatch(clearCommentsError());
          break;
        case "users":
          dispatch(clearUsersError());
          break;
      }
    };
  }, [dispatch, slice]);
};
