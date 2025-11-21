import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CancelSwapDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

export const CancelSwapDialog = ({ isOpen, onClose, onConfirm, loading }: CancelSwapDialogProps) => (
  <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Cancel Swap Request</DialogTitle>
        <DialogDescription>
          Are you sure you want to cancel this swap? This action cannot be undone.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>No, Keep It</Button>
        <Button variant="destructive" onClick={onConfirm} disabled={loading}>
          {loading ? <Loader2 className="animate-spin size-4 mr-2" /> : null}
          Yes, Cancel Swap
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

interface CompleteSwapDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  code: string;
  setCode: (code: string) => void;
  loading: boolean;
}

export const CompleteSwapDialog = ({ isOpen, onClose, onConfirm, code, setCode, loading }: CompleteSwapDialogProps) => (
  <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Complete Swap</DialogTitle>
        <DialogDescription>
          Enter the code provided by the other user to confirm the swap is complete.
        </DialogDescription>
      </DialogHeader>
      <div className="py-4">
        <Input
          placeholder="Enter 6-digit code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={onConfirm} disabled={!code || loading}>
          {loading ? <Loader2 className="animate-spin size-4 mr-2" /> : null}
          Confirm
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

interface AcceptedCodeDialogProps {
  code: string | null;
  onClose: () => void;
}

export const AcceptedCodeDialog = ({ code, onClose }: AcceptedCodeDialogProps) => (
  <Dialog open={!!code} onOpenChange={(open) => !open && onClose()}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="text-center text-green-600">Swap Accepted!</DialogTitle>
        <DialogDescription className="text-center">
          Here is your completion code. Share it when you meet to swap.
        </DialogDescription>
      </DialogHeader>
      <div className="py-6 text-center">
        <div className="text-4xl font-mono font-bold tracking-widest bg-gray-100 p-4 rounded-lg inline-block border-2 border-dashed border-gray-300">
          {code}
        </div>
      </div>
      <DialogFooter className="sm:justify-center">
        <Button onClick={onClose}>Got it</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

interface DeleteItemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

export const DeleteItemDialog = ({ isOpen, onClose, onConfirm, loading }: DeleteItemDialogProps) => (
  <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Delete Item</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete this item? This action cannot be undone.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button variant="destructive" onClick={onConfirm} disabled={loading}>
          {loading ? <Loader2 className="animate-spin size-4 mr-2" /> : null}
          Delete
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
