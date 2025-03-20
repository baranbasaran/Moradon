import axios from "./axios";
import { Comment, PaginatedResponse } from "./types";

export const commentsApi = {
  getAll: async (
    postId: number,
    page = 0,
    size = 10
  ): Promise<PaginatedResponse<Comment>> => {
    const response = await axios.get<PaginatedResponse<Comment>>(
      `/comments/post/${postId}?page=${page}&size=${size}`
    );
    return response.data;
  },

  getById: async (id: number): Promise<Comment> => {
    const response = await axios.get<Comment>(`/comments/${id}`);
    return response.data;
  },

  create: async (
    comment: Omit<Comment, "id" | "createdAt" | "updatedAt" | "user">
  ): Promise<Comment> => {
    const response = await axios.post<Comment>("/comments", comment);
    return response.data;
  },

  update: async (id: number, comment: Partial<Comment>): Promise<Comment> => {
    const response = await axios.put<Comment>(`/comments/${id}`, comment);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`/comments/${id}`);
  },

  getUserComments: async (
    userId: number,
    page = 0,
    size = 10
  ): Promise<PaginatedResponse<Comment>> => {
    const response = await axios.get<PaginatedResponse<Comment>>(
      `/comments/user/${userId}?page=${page}&size=${size}`
    );
    return response.data;
  },
};
