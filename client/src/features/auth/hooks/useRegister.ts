// src/features/auth/hooks/useRegister.ts
import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import type { RegisterRequest, User } from "../api/auth.types";

export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (data: RegisterRequest): Promise<User | void> => {
    try {
      setLoading(true);
      setError(null);


      const user = await useAuthStore.getState().register(data);

      return user; 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Registration failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { register, loading, error };
};
