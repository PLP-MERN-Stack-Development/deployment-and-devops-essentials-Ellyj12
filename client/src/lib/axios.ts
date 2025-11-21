import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const authStorage = localStorage.getItem("auth-storage");
  if (authStorage) {
    try {
      const { state } = JSON.parse(authStorage);
      const token = state?.user?.token;
      if (token) config.headers.Authorization = `Bearer ${token}`;
    } catch (err) {
      console.error("Failed to parse auth storage", err);
    }
  }
  return config;
});