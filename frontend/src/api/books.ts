import axios from "./axios";
import { Book, PaginatedResponse } from "./types";

export const booksApi = {
  getAll: async (page = 0, size = 10): Promise<PaginatedResponse<Book>> => {
    const response = await axios.get<PaginatedResponse<Book>>(
      `/books?page=${page}&size=${size}`
    );
    return response.data;
  },

  getById: async (id: number): Promise<Book> => {
    const response = await axios.get<Book>(`/books/${id}`);
    return response.data;
  },

  search: async (
    query: string,
    page = 0,
    size = 10
  ): Promise<PaginatedResponse<Book>> => {
    const response = await axios.get<PaginatedResponse<Book>>(
      `/books/search?q=${query}&page=${page}&size=${size}`
    );
    return response.data;
  },

  create: async (
    book: Omit<Book, "id" | "createdAt" | "updatedAt">
  ): Promise<Book> => {
    const response = await axios.post<Book>("/books", book);
    return response.data;
  },

  update: async (id: number, book: Partial<Book>): Promise<Book> => {
    const response = await axios.put<Book>(`/books/${id}`, book);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`/books/${id}`);
  },
};
