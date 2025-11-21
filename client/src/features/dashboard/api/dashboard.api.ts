import type { DashboardStats } from "./dashboard.types";
import { api } from "@/lib/axios";

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const res = await api.get("/dashboard");
  return res.data;
};
