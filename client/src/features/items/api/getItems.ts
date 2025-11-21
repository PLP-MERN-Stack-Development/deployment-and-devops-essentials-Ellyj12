import type { GetItemsParams, GetItemsResponse, Item } from "./item.types";
import { api } from "@/lib/axios";

export const itemsApi = {
  async getItems(params: GetItemsParams): Promise<GetItemsResponse> {
    const res = await api.get("/items", { params });
    return res.data as GetItemsResponse;
  },

  async getItem(id: string): Promise<Item> {
    const res = await api.get(`/items/${id}`);
    return res.data;
  },

  async getMyItems(): Promise<Item[]> {
    const res = await api.get("/items/my-items");
    return res.data;
  },

  async createItem(formData: FormData): Promise<Item> {
    const res = await api.post("/items/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  },
};
