import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authApi } from "../api/auth.api";
import type { AuthResponse, LoginRequest, RegisterRequest } from "../api/auth.types";


export interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
  token: string; 
  profilePhoto?: string;
}

interface AuthState {
  user: User | null;
  login: (data: LoginRequest) => Promise<User>;
  register: (data: RegisterRequest) => Promise<User>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,

      login: async (data: LoginRequest) => {
        const res: AuthResponse = await authApi.login(data);

        const user: User = {
          _id: res._id,
          name: res.name,
          username: res.username,
          email: res.email,
          token: res.token,
          profilePhoto: res.profilePhoto,
        };

        set({ user });
        return user;
      },

      register: async (data: RegisterRequest) => {
        const res: AuthResponse = await authApi.register(data);

        const user: User = {
          _id: res._id,
          name: res.name,
          username: res.username,
          email: res.email,
          token: res.token,
          profilePhoto: res.profilePhoto,
        };

        set({ user });
        return user;
      },

      logout: () => set({ user: null }),
    }),
    {
      name: "auth-storage", 
    }
  )
);
