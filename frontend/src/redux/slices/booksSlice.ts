import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { booksApi } from "../../api";
import { Book, PaginatedResponse } from "../../api/types";
import { handleApiError } from "../../utils/apiUtils";
import { RejectedAction } from "../types";

interface BooksState {
  books: Book[];
  currentBook: Book | null;
  totalPages: number;
  currentPage: number;
  loading: boolean;
  error: string | null;
}

const initialState: BooksState = {
  books: [],
  currentBook: null,
  totalPages: 0,
  currentPage: 0,
  loading: false,
  error: null,
};

export const fetchBooks = createAsyncThunk(
  "books/fetchBooks",
  async (
    { page = 0, size = 10 }: { page?: number; size?: number },
    { rejectWithValue }
  ) => {
    try {
      return await booksApi.getAll(page, size);
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const fetchBookById = createAsyncThunk(
  "books/fetchBookById",
  async (id: number, { rejectWithValue }) => {
    try {
      return await booksApi.getById(id);
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const createBook = createAsyncThunk(
  "books/createBook",
  async (
    book: Omit<Book, "id" | "createdAt" | "updatedAt">,
    { rejectWithValue }
  ) => {
    try {
      return await booksApi.create(book);
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const updateBook = createAsyncThunk(
  "books/updateBook",
  async (
    { id, book }: { id: number; book: Partial<Book> },
    { rejectWithValue }
  ) => {
    try {
      return await booksApi.update(id, book);
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const deleteBook = createAsyncThunk(
  "books/deleteBook",
  async (id: number, { rejectWithValue }) => {
    try {
      await booksApi.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

const booksSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentBook: (state) => {
      state.currentBook = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Books
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.books = action.payload.content;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.number;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action as RejectedAction).payload?.message ||
          "Failed to fetch books";
      })
      // Fetch Book By Id
      .addCase(fetchBookById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBook = action.payload;
      })
      .addCase(fetchBookById.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action as RejectedAction).payload?.message || "Failed to fetch book";
      })
      // Create Book
      .addCase(createBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBook.fulfilled, (state, action) => {
        state.loading = false;
        state.books.unshift(action.payload);
      })
      .addCase(createBook.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action as RejectedAction).payload?.message ||
          "Failed to create book";
      })
      // Update Book
      .addCase(updateBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBook.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.books.findIndex(
          (book) => book.id === action.payload.id
        );
        if (index !== -1) {
          state.books[index] = action.payload;
        }
        if (state.currentBook?.id === action.payload.id) {
          state.currentBook = action.payload;
        }
      })
      .addCase(updateBook.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action as RejectedAction).payload?.message ||
          "Failed to update book";
      })
      // Delete Book
      .addCase(deleteBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBook.fulfilled, (state, action) => {
        state.loading = false;
        state.books = state.books.filter((book) => book.id !== action.payload);
        if (state.currentBook?.id === action.payload) {
          state.currentBook = null;
        }
      })
      .addCase(deleteBook.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action as RejectedAction).payload?.message ||
          "Failed to delete book";
      });
  },
});

export const { clearError, clearCurrentBook } = booksSlice.actions;
export default booksSlice.reducer;
