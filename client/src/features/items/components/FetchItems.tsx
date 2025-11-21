import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import type { Item } from "../api/item.types"; // Ensure GetItemsResponse is imported
import { itemsApi } from "../api/getItems";
 // Assuming you created this, or remove if not

export default function TestFetchItems() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // New state to track total pages for UI buttons
  const [totalPages, setTotalPages] = useState(1);

  // 1. Get setSearchParams to update URL when buttons are clicked
  const [searchParams, setSearchParams] = useSearchParams();
  
  const search = searchParams.get("search") || undefined;
  const category = searchParams.get("category") || undefined;
  const condition = searchParams.get("condition") || undefined;
  const type = (searchParams.get("type") as "Trade" | "Free" | null) || undefined;
  const sortBy = (searchParams.get("sortBy") as "latest" | "oldest") || undefined;
  
  // 2. Parse the page from URL (default to 1 if missing)
  const pageParam = searchParams.get("page");
  const currentPage = pageParam ? parseInt(pageParam, 10) : 1;

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      setError(null);

      try {
        // 3. Pass 'page' to the API
        const res = await itemsApi.getItems({ 
          search, 
          category, 
          sortBy, 
          type,
          condition,
          page: currentPage, 
          limit: 10 // Optional: enforce a limit or rely on backend default
        });

        // Handle the specific response structure (GetItemsResponse)
        if ('items' in res) {
            setItems(res.items);
            setTotalPages(res.totalPages);
        } else if (Array.isArray(res)) {
            // Fallback if API returns just an array
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
    // 4. Add currentPage to dependency array so it refetches when URL changes
  }, [search, category, sortBy, type, condition, currentPage]);

  // Helper to change page
  const handlePageChange = (newPage: number) => {
    // Keep existing params, just update page
    setSearchParams(prev => {
        prev.set("page", newPage.toString());
        return prev;
    });
  };

  if (loading) return <p>Loading items...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="space-y-4">
      {items.length === 0 ? (
        <div>No items found.</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4  gap-4 w-full">
          {items.map((item) => (
            <Link to={`/items/${item._id}`} key={item._id} className="block h-full">
              <div className="border p-2 rounded w-full shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
                <div className="w-full h-48 mb-2 bg-gray-200 rounded overflow-hidden shrink-0">
                  {item.images && item.images.length > 0 ? (
                    <img 
                      src={item.images[0]} 
                      alt={item.name}
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>

                <h3 className="font-bold text-lg truncate">{item.name}</h3>
                <p className="text-gray-600 text-sm line-clamp-2 grow">{item.description}</p>
                
                <div className="mt-2 text-xs text-gray-500 flex flex-col items-start gap-2">
                  <div>
                    <span className={`px-2 py-1 rounded text-white ${item.type === 'Free' ? 'bg-green-500' : 'bg-blue-500'}`}>
                    {item.type}
                  </span>
                  </div>
                  <div>
                    <span>Condition: {item.condition}</span>
                  </div>
                  
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* --- PAGINATION CONTROLS --- */}
      {items.length > 0 && (
        <div className="flex justify-center items-center space-x-4 mt-6">
            <button 
                disabled={currentPage <= 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="px-4 py-2 border rounded disabled:opacity-50 hover:bg-gray-100"
            >
                Previous
            </button>
            <span className="text-sm">
                Page {currentPage} of {totalPages}
            </span>
            <button 
                disabled={currentPage >= totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="px-4 py-2 border rounded disabled:opacity-50 hover:bg-gray-100"
            >
                Next
            </button>
        </div>
      )}
    </div>
  );
}