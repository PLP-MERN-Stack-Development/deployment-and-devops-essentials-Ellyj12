import type { categoryResponse } from "./category.types";
import { api } from "@/lib/axios";

export const categoriesApi = {
  async getCategories(): Promise<categoryResponse> {
    const res = await api.get("/categories");
    return res.data as categoryResponse;
  },
};