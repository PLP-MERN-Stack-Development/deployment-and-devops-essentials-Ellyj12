import { useState, useEffect, useCallback } from "react";
import type { Item, GetItemsParams, GetItemsResponse } from "../api/item.types";
import { itemsApi } from "../api/getItems";

export function useItems(initialParams?: Partial<GetItemsParams>) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<GetItemsParams>(initialParams || {});
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalItems: 0,
  });

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await itemsApi.getItems(params) as GetItemsResponse;
      setItems(res.items);
      setPagination({
        page: res.page,
        totalPages: res.totalPages,
        totalItems: res.totalItems,
      });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to fetch items");
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const updateParams = (newParams: Partial<GetItemsParams>) => {
    setParams((prev) => ({ ...prev, ...newParams }));
  };

  return { items, loading, error, params, updateParams, pagination, fetchItems };
}
