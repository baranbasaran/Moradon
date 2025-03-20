import axios from "./axios";
import { AuthResponse, LoginCredentials, SignupCredentials } from "./types";

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await axios.post<AuthResponse>("/auth/login", credentials);
    return response.data;
  },

  signup: async (credentials: SignupCredentials): Promise<AuthResponse> => {
    const response = await axios.post<AuthResponse>(
      "/auth/signup",
      credentials
    );
    return response.data;
  },

  logout: async (): Promise<void> => {
    await axios.post("/auth/logout");
  },

  getCurrentUser: async (): Promise<AuthResponse> => {
    const response = await axios.get<AuthResponse>("/auth/me");
    return response.data;
  },
};
