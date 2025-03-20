import React, { useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { fetchPosts } from "../redux/slices/postsSlice";
import { fetchBooks } from "../redux/slices/booksSlice";
import PostComposer from "../components/PostComposer";
import PostList from "../components/PostList";
import BookList from "../components/BookList";
import LoadingSpinner from "../components/common/LoadingSpinner";

// Memoized selectors
const selectPosts = (state: RootState) => state.posts.posts;
const selectPostsLoading = (state: RootState) => state.posts.loading;
const selectBooks = (state: RootState) => state.books.books;
const selectBooksLoading = (state: RootState) => state.books.loading;

const HomePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Use individual selectors to prevent unnecessary re-renders
  const posts = useSelector(selectPosts);
  const postsLoading = useSelector(selectPostsLoading);
  const books = useSelector(selectBooks);
  const booksLoading = useSelector(selectBooksLoading);

  // Memoize the filtered posts count
  const userPostsCount = useMemo(() => {
    if (!posts) return 0;
    return posts.filter((post) => post.user?.id === 1).length;
  }, [posts]);

  // Memoize the fetch function
  const fetchData = useCallback(async () => {
    try {
      await Promise.all([
        dispatch(fetchPosts({ page: 0, size: 5 })),
        dispatch(fetchBooks({ page: 0, size: 3 })),
      ]);
    } catch (error) {
      console.error("[HomePage] Error fetching data:", error);
    }
  }, [dispatch]);

  // Fetch data only once on mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const isLoading = postsLoading || booksLoading;

  // Memoize the main content to prevent unnecessary re-renders
  const mainContent = useMemo(
    () => (
      <div className="lg:col-span-2 space-y-8">
        <PostComposer />
        <PostList posts={posts || []} />
      </div>
    ),
    [posts]
  );

  // Memoize the sidebar content
  const sidebarContent = useMemo(
    () => (
      <div className="space-y-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Recent Books
          </h2>
          <BookList books={books || []} />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Your Activity
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-300">Posts</span>
              <span className="font-semibold text-gray-800 dark:text-white">
                {userPostsCount}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-300">
                Books Read
              </span>
              <span className="font-semibold text-gray-800 dark:text-white">
                {(books || []).length}
              </span>
            </div>
          </div>
        </div>
      </div>
    ),
    [books, userPostsCount]
  );

  // Memoize the loading spinner
  const loadingContent = useMemo(
    () => (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    ),
    []
  );

  // Render the appropriate content based on loading state
  return isLoading ? (
    loadingContent
  ) : (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {mainContent}
        {sidebarContent}
      </div>
    </div>
  );
};

export default React.memo(HomePage);
