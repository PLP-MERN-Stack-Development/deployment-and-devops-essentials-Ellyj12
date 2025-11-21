import { api } from "@/lib/axios";
import type { LoginRequest, RegisterRequest, AuthResponse } from "./auth.types";

export const authApi = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const res = await api.post("/auth/login", data);
    return res.data;
  },

 async register(data: RegisterRequest): Promise<AuthResponse> {
  try {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("password", data.password);
    if (data.profilePhoto) {
      formData.append("profilePhoto", data.profilePhoto);
    }

    const res = await api.post("/auth/register", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    // Throw field errors directly
    throw err.response?.data?.errors || { general: "Registration failed" };
  }
}

};
