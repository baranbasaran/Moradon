// Auth Types
export interface LoginCredentials {
  identifier: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupCredentials {
  username: string;
  email: string;
  password: string;
  birthDate: string;
  name: string;
  phoneNumber: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
}

// User Types
export interface User {
  id: number;
  username: string;
  email: string;
  birthDate: string;
  identifier: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

// Book Types
export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  price: number;
  description: string;
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
}

// Post Types
export interface Post {
  id: number;
  title: string;
  content: string;
  book: Book;
  user: User;
  likes: number;
  likedBy?: number[]; // Array of user IDs who liked the post
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

// Comment Types
export interface Comment {
  id: number;
  content: string;
  user: User;
  post: Post;
  createdAt: string;
  updatedAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

// Error Types
export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}
