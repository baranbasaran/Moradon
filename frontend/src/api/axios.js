import axios from "axios";
import { getToken, getRefreshToken, setTokens, removeTokens, isTokenExpired } from "./utils/tokenUtils";

const apiClient = axios.create({
  baseURL: "http://localhost:8080/v1",
});

// Flag to prevent multiple refresh token requests
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.request.use(
  async (config) => {
    const token = getToken();
    
    if (token) {
      if (isTokenExpired(token) && config.url !== '/auth/refresh') {
        const refreshToken = getRefreshToken();
        
        if (!isRefreshing) {
          isRefreshing = true;
          
          try {
            const response = await axios.post("http://localhost:8080/v1/auth/refresh", {
              refreshToken: refreshToken
            });
            
            const { token: newToken, refreshToken: newRefreshToken } = response.data;
            setTokens(newToken, newRefreshToken);
            
            config.headers.Authorization = `Bearer ${newToken}`;
            processQueue(null, newToken);
          } catch (error) {
            processQueue(error, null);
            removeTokens();
            window.location.href = '/login';
            return Promise.reject(error);
          } finally {
            isRefreshing = false;
          }
        } else {
          // Add request to queue if refresh is in progress
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then(token => {
            config.headers.Authorization = `Bearer ${token}`;
            return config;
          }).catch(err => {
            return Promise.reject(err);
          });
        }
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      if (!isRefreshing) {
        isRefreshing = true;
        const refreshToken = getRefreshToken();

        try {
          const response = await axios.post("http://localhost:8080/v1/auth/refresh", {
            refreshToken: refreshToken
          });
          
          const { token: newToken, refreshToken: newRefreshToken } = response.data;
          setTokens(newToken, newRefreshToken);
          
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          
          processQueue(null, newToken);
          return apiClient(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          removeTokens();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      } else {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          return apiClient(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
