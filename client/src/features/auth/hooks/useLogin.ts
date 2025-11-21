import { useAuthStore } from "../store/authStore";
import { useState } from "react";

export const useLogin = () => {
  const loginStore = useAuthStore((s) => s.login);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (emailOrUsername: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const body = emailOrUsername.includes("@")
        ? { email: emailOrUsername, password }
        : { username: emailOrUsername, password };

      const user = await loginStore(body);
      return user;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleLogin, loading, error };
};
