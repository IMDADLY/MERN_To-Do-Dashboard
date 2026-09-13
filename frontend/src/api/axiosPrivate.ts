import axios from "axios";
import axiosAuth from "./axiosAuth";
import { toast } from "react-toastify";
const axiosPrivate = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});
let isRefreshing = false;
let failedQueue = [];
const processQueue = (error = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve();
    }
  });
  failedQueue = [];
};

axiosPrivate.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return axiosPrivate(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await axiosAuth.post("/refresh");
        processQueue();
        return axiosPrivate(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        setTimeout(() => {
          window.location.href = "auth/login";
        }, 20000);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    if (error.response) {
      toast.error(error.response.data.message);
    } else {
      toast.error("Network error. Please check your connection.");
    }
    return Promise.reject(error);
  },
);
export default axiosPrivate;
