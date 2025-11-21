export interface Item {
  _id: string;
  name: string;
  description: string;
  category: { _id: string; name: string } | string;
  type?: string;
  owner: { _id: string; name: string; username: string };
  createdAt: string;
  condition: string;
  images: string[];
  desiredItem?: string;
  desiredCategory?: { _id: string; name: string } | string;
  location?: {
    type: "Point";
    coordinates: number[];
  };
  isAvailable?: boolean;
}
export interface CreateItemRequest{
  name: string;
  description: string;
  category: string;
  desiredItem: string;
  type: string;
  listingDuration : number;
  images : [string];
}

export interface GetItemsParams {
  id?: string;
  category?: string;
  owner?: string;
  type?: string;
  condition?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: "latest" | "oldest";
}

export interface SearchBarProps {
  onSearch :(term:string)=>void;
  initialValue?: string;
}

export interface GetItemsResponse {
  page: number;
  totalPages: number;
  totalItems: number;
  items: Item[];
}
export interface FilterModalProps{
  isOpen: boolean;
  onClose: ()=>void;
  currentParams: Partial<GetItemsParams>;
  onApply: (params: Partial<GetItemsParams>)=> void;
  onReset: ()=>void
  
}
