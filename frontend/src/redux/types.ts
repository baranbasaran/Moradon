import { ApiError } from "../api/types";

export interface User {
  id: string;
  email: string;
  username: string;
  name?: string;
  birthDate?: string;
  avatarUrl?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

export interface RootState {
  auth: AuthState;
  user: UserState;
  posts: PostState;
}

export interface UserState {
  profile: User | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

export interface Post {
  id: string;
  content: string;
  author: User;
  createdAt: string;
  updatedAt: string;
  likes: number;
  comments: Comment[];
  mediaUrls?: string[];
  views?: number;
  reposts?: number;
  currentUserAvatar?: string;
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  createdAt: string;
  updatedAt: string;
  likes: number;
}

export interface PostState {
  posts: Post[];
  currentPost: Post | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

export interface RejectedWithValue {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

export type RejectedAction = {
  type: string;
  payload: RejectedWithValue;
  error: { message: string };
};
