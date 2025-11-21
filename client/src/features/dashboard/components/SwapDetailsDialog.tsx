import { Button } from "@/components/ui/button";
import { Loader2, Ban, CheckCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Swap } from "../api/dashboard.types";

interface SwapDetailsDialogProps {
  swap: Swap | null;
  isOpen: boolean;
  onClose: () => void;
  onCancel: (id: string) => void;
  onComplete: (id: string) => void;
  actionLoading: string | null;
  user: { _id: string } | null;
}

export const SwapDetailsDialog = ({ 
  swap, 
  isOpen, 
  onClose, 
  onCancel, 
  onComplete, 
  actionLoading,
  user 
}: SwapDetailsDialogProps) => {
  if (!swap) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Swap Details</DialogTitle>
          <DialogDescription>
            Review the details of this swap transaction.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-8">
            {/* Initiator Side */}
            <div className="text-center space-y-2">
              <p className="font-semibold text-sm text-gray-500">Initiator: {swap.initiator.username}</p>
              <div className="aspect-square bg-gray-100 rounded-md overflow-hidden border relative">
                {swap.initiatorItem?.images?.[0] ? (
                  <img src={swap.initiatorItem.images[0]} alt={swap.initiatorItem.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50 text-xs p-2 text-center">
                    {swap.initiatorItem ? "No Image" : "Item Removed"}
                  </div>
                )}
              </div>
              <p className="font-medium">{swap.initiatorItem?.name || <span className="text-gray-400 italic">Item Removed</span>}</p>
            </div>

            {/* Owner Side */}
            <div className="text-center space-y-2">
              <p className="font-semibold text-sm text-gray-500">Owner: {swap.owner.username}</p>
              <div className="aspect-square bg-gray-100 rounded-md overflow-hidden border relative">
                {swap.ownerItem?.images?.[0] ? (
                  <img src={swap.ownerItem.images[0]} alt={swap.ownerItem.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50 text-xs p-2 text-center">
                    {swap.ownerItem ? "No Image" : "Item Removed"}
                  </div>
                )}
              </div>
              <p className="font-medium">{swap.ownerItem?.name || <span className="text-gray-400 italic">Item Removed</span>}</p>
            </div>
          </div>

          <div className="flex justify-center">
            <span className={`px-3 py-1 rounded-full text-sm font-bold ${
              swap.status === 'Completed' ? 'bg-green-100 text-green-800' :
              swap.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
              swap.status === 'Accepted' ? 'bg-blue-100 text-blue-800' :
              'bg-red-100 text-red-800'
            }`}>
              Status: {swap.status}
            </span>
          </div>

          {/* Code Display in Modal */}
          {swap.status === 'Accepted' && swap.codes && (
             <div className="bg-gray-50 p-4 rounded-lg border text-center">
                <p className="text-sm text-gray-500 mb-1">Your Completion Code</p>
                <p className="text-2xl font-mono font-bold tracking-widest">
                  {swap.codes.find(c => c.user === user?._id)?.code || "N/A"}
                </p>
                <p className="text-xs text-gray-400 mt-1">Share this code with the other user to complete the swap.</p>
             </div>
          )}

          <DialogFooter className="sm:justify-center gap-2">
            {/* Cancel Logic */}
            {['Pending', 'Accepted'].includes(swap.status) && (
              <Button 
                variant="destructive" 
                onClick={() => onCancel(swap._id)}
                disabled={!!actionLoading}
              >
                {actionLoading === swap._id ? <Loader2 className="animate-spin size-4 mr-2" /> : <Ban className="size-4 mr-2" />}
                Cancel Swap
              </Button>
            )}

            {/* Complete Logic */}
            {swap.status === 'Accepted' && (
              <Button 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => onComplete(swap._id)}
              >
                <CheckCircle className="size-4 mr-2" />
                Complete Swap
              </Button>
            )}
            <Button variant="outline" onClick={onClose}>Close</Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};
