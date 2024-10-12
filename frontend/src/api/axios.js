import axios from "axios";
import { getToken } from "./utils/tokenUtils";

const apiClient = axios.create({
  baseURL: "http://localhost:8080/v1",
});

apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
