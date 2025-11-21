import { useDashboard } from "../hooks/useDashboard";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/features/auth/store/authStore";
import { swapApi } from "@/features/swaps/api/swap.api";
import { useState } from "react";
import { api } from "@/lib/axios";
import type { Swap } from "../api/dashboard.types";

// Components
import { DashboardStatsSection } from "./DashboardStats";
import { PendingRequests } from "./PendingRequests";
import { MyListings } from "./MyListings";
import { SwapHistory } from "./SwapHistory";
import { SwapDetailsDialog } from "./SwapDetailsDialog";
import { 
  CancelSwapDialog, 
  CompleteSwapDialog, 
  AcceptedCodeDialog, 
  DeleteItemDialog 
} from "./DashboardDialogs";

const DashboardContent = () => {
  const { data, loading, error, refetch } = useDashboard();
  const user = useAuthStore((s) => s.user);
  
  // State
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [completeCode, setCompleteCode] = useState("");
  const [selectedSwapId, setSelectedSwapId] = useState<string | null>(null);
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);
  const [viewSwap, setViewSwap] = useState<Swap | null>(null);
  const [cancelSwapId, setCancelSwapId] = useState<string | null>(null);
  const [acceptedCode, setAcceptedCode] = useState<string | null>(null);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);

  // Handlers
  const handleAccept = async (swapId: string) => {
    try {
      setActionLoading(swapId);
      const res = await swapApi.acceptSwap(swapId);
      await refetch();
      if (res.codes?.owner) {
        setAcceptedCode(res.codes.owner);
      }
    } catch (error) {
      console.error("Failed to accept swap", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDecline = async (swapId: string) => {
    try {
      setActionLoading(swapId);
      await swapApi.declineSwap(swapId);
      await refetch();
    } catch (error) {
      console.error("Failed to decline swap", error);
    } finally {
      setActionLoading(null);
    }
  };

  const confirmCancel = (swapId: string) => {
    setCancelSwapId(swapId);
  };

  const handleCancelSwap = async () => {
    if (!cancelSwapId) return;
    try {
      setActionLoading(cancelSwapId);
      await swapApi.cancelSwap(cancelSwapId);
      await refetch();
      setCancelSwapId(null);
      if (viewSwap?._id === cancelSwapId) setViewSwap(null);
    } catch (error) {
      console.error("Failed to cancel swap", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleComplete = async () => {
    if (!selectedSwapId || !completeCode) return;
    try {
      setActionLoading(selectedSwapId);
      await swapApi.completeSwap(selectedSwapId, completeCode);
      await refetch();
      setIsCompleteDialogOpen(false);
      setCompleteCode("");
      setSelectedSwapId(null);
    } catch (error) {
      console.error("Failed to complete swap", error);
      alert("Invalid code or error completing swap");
    } finally {
      setActionLoading(null);
    }
  };

  const openCompleteDialog = (swapId: string) => {
    setSelectedSwapId(swapId);
    setIsCompleteDialogOpen(true);
  };

  const handleDeleteItem = async () => {
    if (!deleteItemId) return;
    try {
      setActionLoading(deleteItemId);
      await api.delete(`/items/${deleteItemId}`);
      await refetch();
      setDeleteItemId(null);
    } catch (error) {
      console.error("Failed to delete item", error);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin size-8 text-gray-500" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-4">Error loading dashboard data.</div>;
  }

  if (!data) return null;

  return (
    <div className="overflow-y-auto p-6 space-y-8 h-full">
      <DashboardStatsSection data={data} user={user} />

      <PendingRequests 
        requests={data.pendingRequests} 
        onAccept={handleAccept} 
        onDecline={handleDecline} 
        actionLoading={actionLoading} 
      />

      <MyListings 
        listings={data.listings} 
        onDelete={setDeleteItemId} 
      />

      <SwapHistory 
        swaps={data.swaps} 
        user={user} 
        onViewSwap={setViewSwap} 
      />

      {/* Dialogs */}
      <SwapDetailsDialog 
        swap={viewSwap}
        isOpen={!!viewSwap}
        onClose={() => setViewSwap(null)}
        onCancel={(id) => {
          setViewSwap(null);
          confirmCancel(id);
        }}
        onComplete={(id) => {
          setViewSwap(null);
          setTimeout(() => openCompleteDialog(id), 100);
        }}
        actionLoading={actionLoading}
        user={user}
      />

      <CancelSwapDialog 
        isOpen={!!cancelSwapId}
        onClose={() => setCancelSwapId(null)}
        onConfirm={handleCancelSwap}
        loading={!!actionLoading}
      />

      <CompleteSwapDialog 
        isOpen={isCompleteDialogOpen}
        onClose={() => setIsCompleteDialogOpen(false)}
        onConfirm={handleComplete}
        code={completeCode}
        setCode={setCompleteCode}
        loading={!!actionLoading}
      />

      <AcceptedCodeDialog 
        code={acceptedCode}
        onClose={() => setAcceptedCode(null)}
      />

      <DeleteItemDialog 
        isOpen={!!deleteItemId}
        onClose={() => setDeleteItemId(null)}
        onConfirm={handleDeleteItem}
        loading={!!actionLoading}
      />
    </div>
  );
};

export default DashboardContent;