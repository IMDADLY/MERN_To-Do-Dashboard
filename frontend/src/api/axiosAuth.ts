import axios from "axios";
import { toast } from "react-toastify";
const axiosAuth = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/auth`,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

axiosAuth.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      toast.error(error.response.data.message);
    } else {
      toast.error("Network failed. Please check your connection.");
    }
    return Promise.reject(error);
  },
);
export default axiosAuth;
