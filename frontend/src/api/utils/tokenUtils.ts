import { jwtDecode } from "jwt-decode";
import { User } from "../../redux/types";

// Token storage keys
const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const USER_KEY = "user";

interface DecodedToken {
  exp: number;
  userId: string;
  username: string;
}

export const setTokens = (
  accessToken: string,
  refreshToken: string,
  user?: User | null
): void => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
};

export const getToken = (): string | null => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

export const getUser = (): User | null => {
  const userStr = localStorage.getItem(USER_KEY);
  try {
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};

export const removeTokens = (): void => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;
  try {
    const decoded = JSON.parse(atob(token.split(".")[1])) as DecodedToken;
    return decoded.exp * 1000 < Date.now();
  } catch (error) {
    return true;
  }
};
