import type { Item } from "@/features/items/api/item.types";

export interface Swap {
  _id: string;
  status: string;
  initiator: { _id: string; username: string };
  owner: { _id: string; username: string };
  createdAt: string;
  initiatorItem?: { name: string; images: string[] };
  ownerItem?: { name: string; images: string[] };
  codes?: { user: string; code: string }[];
}

export interface DashboardStats {
  points: number;
  totalListings: number;
  activeListingsCount: number;
  listings: Item[]; 
  swaps: Swap[];
  pendingRequests: Swap[];    
}

