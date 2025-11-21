import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { itemsApi } from "../api/getItems";
import type { Item } from "../api/item.types";
import { ItemsGrid } from "../components/ItemsGrid";
import { Pagination } from "@/components/ui/Pagination";

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);

  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("search") || undefined;
  const category = searchParams.get("category") || undefined;
  const condition = searchParams.get("condition") || undefined;
  const type =
    (searchParams.get("type") as "Trade" | "Free" | null) || undefined;
  const sortBy =
    (searchParams.get("sortBy") as "latest" | "oldest") || undefined;

  const pageParam = searchParams.get("page");
  const currentPage = pageParam ? parseInt(pageParam, 10) : 1;

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await itemsApi.getItems({
          search,
          category,
          sortBy,
          type,
          condition,
          page: currentPage,
          limit: 10,
        });

        if ("items" in res) {
          setItems(res.items);
          setTotalPages(res.totalPages);
        } else if (Array.isArray(res)) {
          setItems(res);
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error(err);
        setError(err?.response?.data?.message || "Failed to fetch items");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [search, category, sortBy, type, condition, currentPage]);

  const handlePageChange = (newPage: number) => {
    setSearchParams((prev) => {
      prev.set("page", newPage.toString());
      return prev;
    });
  };

  return (
    <div className="p-4 py-7 space-y-6">
      {loading ? (
        <p>Loading items...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          <ItemsGrid items={items} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}
