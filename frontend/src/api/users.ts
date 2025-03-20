import axios from "./axios";
import { User, PaginatedResponse } from "./types";

export const usersApi = {
  getAll: async (page = 0, size = 10): Promise<PaginatedResponse<User>> => {
    const response = await axios.get<PaginatedResponse<User>>(
      `/users?page=${page}&size=${size}`
    );
    return response.data;
  },

  getById: async (id: number): Promise<User> => {
    const response = await axios.get<User>(`/users/${id}`);
    return response.data;
  },

  update: async (id: number, user: Partial<User>): Promise<User> => {
    const response = await axios.put<User>(`/users/${id}`, user);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`/users/${id}`);
  },

  updateAvatar: async (id: number, avatar: File): Promise<User> => {
    const formData = new FormData();
    formData.append("avatar", avatar);
    const response = await axios.put<User>(`/users/${id}/avatar`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  search: async (
    query: string,
    page = 0,
    size = 10
  ): Promise<PaginatedResponse<User>> => {
    const response = await axios.get<PaginatedResponse<User>>(
      `/users/search?q=${query}&page=${page}&size=${size}`
    );
    return response.data;
  },
};
