import axios from "./axios";
import { Post, PaginatedResponse } from "./types";

export interface CreatePostRequest {
  content: string;
}

export const postsApi = {
  getAll: async (page = 0, size = 10): Promise<PaginatedResponse<Post>> => {
    const response = await axios.get<PaginatedResponse<Post>>(
      `/posts?page=${page}&size=${size}`
    );
    return response.data;
  },

  getById: async (id: number): Promise<Post> => {
    const response = await axios.get<Post>(`/posts/${id}`);
    return response.data;
  },

  create: async (post: CreatePostRequest): Promise<Post> => {
    console.log("Creating post with data:", post);
    const formData = new FormData();
    formData.append("content", post.content);
    console.log("FormData:", Object.fromEntries(formData.entries()));
    const response = await axios.post<Post>("/posts", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Post creation response:", response.data);
    return response.data;
  },

  update: async (id: number, post: Partial<Post>): Promise<Post> => {
    const response = await axios.put<Post>(`/posts/${id}`, post);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`/posts/${id}`);
  },

  like: async (id: number): Promise<Post> => {
    const response = await axios.post<Post>(`/posts/${id}/like`);
    return response.data;
  },

  unlike: async (id: number): Promise<Post> => {
    const response = await axios.post<Post>(`/posts/${id}/unlike`);
    return response.data;
  },

  getUserPosts: async (
    userId: number,
    page = 0,
    size = 10
  ): Promise<PaginatedResponse<Post>> => {
    const response = await axios.get<PaginatedResponse<Post>>(
      `/posts/user/${userId}?page=${page}&size=${size}`
    );
    return response.data;
  },
};
