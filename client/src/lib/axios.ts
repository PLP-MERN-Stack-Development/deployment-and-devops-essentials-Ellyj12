// config/api.js
import axios from "axios";

// Define the domain only
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const api = axios.create({
  // Explicitly append /api here so you don't have to worry about it in .env
  baseURL: `${BASE_URL}/api`, 
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