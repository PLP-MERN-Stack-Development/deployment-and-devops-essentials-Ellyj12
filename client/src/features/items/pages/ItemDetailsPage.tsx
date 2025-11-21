import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { itemsApi } from "../api/getItems";
import { swapApi } from "@/features/swaps/api/swap.api";
import type { Item } from "../api/item.types";
import { useAuthStore } from "@/features/auth/store/authStore";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// Components
import { ItemImageGallery } from "../components/ItemImageGallery";
import { ItemInfo } from "../components/ItemInfo";
import { SwapRequestDialog } from "../components/SwapRequestDialog";

export default function ItemDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Swap Dialog State
  const [isSwapDialogOpen, setIsSwapDialogOpen] = useState(false);
  const [myItems, setMyItems] = useState<Item[]>([]);
  const [loadingMyItems, setLoadingMyItems] = useState(false);
  const [selectedMyItemId, setSelectedMyItemId] = useState<string | null>(null);
  const [submittingSwap, setSubmittingSwap] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchItem = async () => {
      try {
        setLoading(true);
        const data = await itemsApi.getItem(id);
        setItem(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load item details.");
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  const handleOpenSwapDialog = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setIsSwapDialogOpen(true);
    try {
      setLoadingMyItems(true);
      const items = await itemsApi.getMyItems();
      // Filter to show only available items
      setMyItems(items.filter((i) => i.isAvailable !== false));
    } catch (err) {
      console.error("Failed to fetch my items", err);
    } finally {
      setLoadingMyItems(false);
    }
  };

  const handleCreateSwap = async () => {
    if (!item) return;
    
    // For "Free" items, no need to select an item
    if (item.type === "Free") {
      try {
        setSubmittingSwap(true);
        await swapApi.createSwap({
          ownerItemID: item._id,
          initiatorItemID: null, // No item needed for free items
        });
        setIsSwapDialogOpen(false);
        alert("Request sent successfully!");
        navigate("/dashboard");
      } catch (err) {
        console.error("Failed to create request", err);
        alert((err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to send request");
      } finally {
        setSubmittingSwap(false);
      }
      return;
    }

    // For "Trade" items, require item selection
    if (!selectedMyItemId) return;

    try {
      setSubmittingSwap(true);
      await swapApi.createSwap({
        ownerItemID: item._id,
        initiatorItemID: selectedMyItemId,
      });
      setIsSwapDialogOpen(false);
      // Show success message
      alert("Swap request sent successfully!"); // Replace with toast if available
      navigate("/dashboard");
    } catch (err) {
      console.error("Failed to create swap", err);
      alert((err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to create swap request");
    } finally {
      setSubmittingSwap(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin size-10 text-gray-500" />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="container mx-auto p-6 text-center">
        <p className="text-red-500 text-lg">{error || "Item not found"}</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </div>
    );
  }

  const isOwner = user?._id === item.owner._id;

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-5xl">
      <Button
        variant="ghost"
        className="mb-4 pl-0 hover:bg-transparent hover:underline"
        onClick={() => navigate(-1)}
      >
        &larr; Back to listings
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <ItemImageGallery item={item} />

        {/* Details */}
        <ItemInfo
          item={item}
          isOwner={isOwner}
          onSwapRequest={handleOpenSwapDialog}
        />
      </div>

      {/* Swap Request Dialog */}
      <SwapRequestDialog
        isOpen={isSwapDialogOpen}
        onClose={() => setIsSwapDialogOpen(false)}
        item={item}
        myItems={myItems}
        loadingMyItems={loadingMyItems}
        selectedMyItemId={selectedMyItemId}
        onSelectMyItem={setSelectedMyItemId}
        onSubmit={handleCreateSwap}
        submitting={submittingSwap}
      />
    </div>
  );
}