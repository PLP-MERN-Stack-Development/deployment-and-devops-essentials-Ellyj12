import { useState } from "react";
import { itemsApi } from "../api/getItems";
import type { Item } from "../api/item.types";

export function useCreateItem() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createItem = async (formData: FormData): Promise<Item | void> => {
    try {
      setLoading(true);
      setError(null);
      const item = await itemsApi.createItem(formData);
      return item;
    } catch (err) {
      console.error(err);
      setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to create item");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createItem, loading, error };
}
