import { Button } from "@/components/ui/button";
import { Loader2, Check, X } from "lucide-react";
import type { Swap } from "../api/dashboard.types";

interface PendingRequestsProps {
  requests: Swap[];
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
  actionLoading: string | null;
}

export const PendingRequests = ({ requests, onAccept, onDecline, actionLoading }: PendingRequestsProps) => {
  if (!requests || requests.length === 0) return null;

  return (
    <section id="pendingRequests">
      <h2 className="text-2xl font-bold mb-4 text-orange-600">Pending Requests (Action Required)</h2>
      <div className="space-y-4">
        {requests.map((swap) => (
          <div key={swap._id} className="bg-orange-50 p-4 rounded-lg shadow border border-orange-200 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex-1">
              <p className="font-medium text-lg">
                <span className="font-bold">{swap.initiator?.username}</span> wants to swap for your{" "}
                <span className="font-bold">{swap.ownerItem?.name}</span>
              </p>
              <p className="text-sm text-gray-600">
                Offering: <span className="font-semibold">{swap.initiatorItem?.name}</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(swap.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => onAccept(swap._id)} 
                disabled={actionLoading === swap._id}
                className="bg-green-600 hover:bg-green-700"
              >
                {actionLoading === swap._id ? <Loader2 className="animate-spin size-4" /> : <Check className="size-4 mr-2" />}
                Accept
              </Button>
              <Button 
                variant="destructive"
                onClick={() => onDecline(swap._id)}
                disabled={actionLoading === swap._id}
              >
                {actionLoading === swap._id ? <Loader2 className="animate-spin size-4" /> : <X className="size-4 mr-2" />}
                Decline
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
