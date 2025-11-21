import type { Item } from "../api/item.types";
import { Loader2, Plus, ArrowLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

interface SwapRequestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  item: Item;
  myItems: Item[];
  loadingMyItems: boolean;
  selectedMyItemId: string | null;
  onSelectMyItem: (id: string) => void;
  onSubmit: () => void;
  submitting: boolean;
}

export function SwapRequestDialog({
  isOpen,
  onClose,
  item,
  myItems,
  loadingMyItems,
  selectedMyItemId,
  onSelectMyItem,
  onSubmit,
  submitting,
}: SwapRequestDialogProps) {
  const navigate = useNavigate();
  
  // For "Free" items, skip the dialog and confirm directly
  const isFreeItem = item.type === "Free";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {isFreeItem ? "Request Free Item" : "Select an Item to Swap"}
          </DialogTitle>
          <DialogDescription>
            {isFreeItem ? (
              <>
                You're requesting <strong>{item.name}</strong> which is listed as free.
              </>
            ) : (
              <>
                Choose one of your listings to offer for <strong>{item.name}</strong>.
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        {isFreeItem ? (
          <div className="py-8 text-center space-y-4">
            <p className="text-gray-600">
              This item is being offered for free. Click confirm to send your request to the owner.
            </p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-1">{loadingMyItems ? (
            <div className="flex justify-center py-8">
              <Loader2 className="animate-spin size-8 text-gray-400" />
            </div>
          ) : myItems.length === 0 ? (
            <div className="text-center py-8 space-y-4">
              <p className="text-gray-500">
                You don't have any active listings to swap.
              </p>
              <Button onClick={() => navigate("/create")}>
                <Plus className="mr-2 size-4" /> Create New Listing
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">{/* Create New Option */}
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-gray-400 transition-colors min-h-[150px]"
                onClick={() => navigate("/create")}
              >
                <Plus className="size-8 text-gray-400 mb-2" />
                <span className="text-sm font-medium text-gray-600">
                  Create New Listing
                </span>
              </div>

              {/* Existing Items */}
              {myItems.map((myItem) => (
                <div
                  key={myItem._id}
                  className={`border rounded-lg overflow-hidden cursor-pointer transition-all relative ${
                    selectedMyItemId === myItem._id
                      ? "ring-2 ring-indigo-600 border-indigo-600 bg-indigo-50"
                      : "hover:border-gray-400"
                  }`}
                  onClick={() => onSelectMyItem(myItem._id)}
                >
                  <div className="aspect-square bg-gray-200">
                    {myItem.images?.[0] ? (
                      <img
                        src={myItem.images[0]}
                        alt={myItem.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="p-2">
                    <p className="font-medium text-sm truncate">{myItem.name}</p>
                    <p className="text-xs text-gray-500">{myItem.condition}</p>
                  </div>
                  {selectedMyItemId === myItem._id && (
                    <div className="absolute top-2 right-2 bg-indigo-600 text-white rounded-full p-1">
                      <ArrowLeftRight className="size-3" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          </div>
        )}

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
            disabled={(!isFreeItem && !selectedMyItemId) || submitting}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            {submitting && <Loader2 className="animate-spin mr-2 size-4" />}
            {isFreeItem ? "Confirm Request" : "Send Swap Request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
