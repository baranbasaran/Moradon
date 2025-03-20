import axios from "axios";
import { getToken, setTokens, getRefreshToken } from "./utils/tokenUtils";
import { store } from "../redux/store";
import { login } from "../redux/slices/authSlice";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

instance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Only set Content-Type if it's not already set (for form data)
    if (!config.headers["Content-Type"]) {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/v1/auth/refresh`,
          {
            refreshToken,
          }
        );

        const { token, refreshToken: newRefreshToken, user } = response.data;

        // Update tokens in localStorage
        setTokens(token, newRefreshToken, user);

        // Update Redux state
        store.dispatch(
          login.fulfilled({ token, refreshToken: newRefreshToken, user }, "", {
            identifier: "",
            password: "",
          })
        );

        // Update the original request's authorization header
        originalRequest.headers.Authorization = `Bearer ${token}`;

        // Retry the original request
        return instance(originalRequest);
      } catch (refreshError) {
        // If refresh token fails, clear tokens and redirect to login
        setTokens("", "", null);
        store.dispatch(
          login.rejected(null, "", { identifier: "", password: "" })
        );
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
