import { useEffect, useState } from "react";
import type { Category } from "../api/category.types";
import { categoriesApi } from "../api/getCategories";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchCategories = async () => {
      setLoading(true);
      try {
        const res = await categoriesApi.getCategories();

        // Backend sends an array, not an object
        if (mounted) setCategories(res.categories);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error(err);
        if (mounted) setError(err?.response?.data?.message || "Failed to fetch categories");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchCategories();
    return () => {
      mounted = false;
    };
  }, []);

  return { categories, loading, error };
}
