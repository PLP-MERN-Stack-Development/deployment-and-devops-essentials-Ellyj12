import type { Item } from "../api/item.types";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ItemCardProps {
  item: Item;
  onDelete?: (id: string) => void;
}

export function ItemCard({ item, onDelete }: ItemCardProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow border hover:shadow-md transition-all relative group h-full flex flex-col">
      <div className="w-full aspect-square mb-3 bg-gray-100 rounded-md overflow-hidden border">
        {item.images && item.images.length > 0 ? (
          <img
            src={item.images[0]}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            No Image
          </div>
        )}
      </div>

      <h3 className="font-bold text-lg truncate text-gray-900">{item.name}</h3>
      <p className="text-gray-500 text-sm line-clamp-2 mt-1 grow">{item.description}</p>

      <div className="mt-3 flex justify-between items-end">
        <div className="flex flex-col items-start gap-2">
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                item.type === "Free" 
                  ? "bg-green-100 text-green-800" 
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {item.type || 'Trade'}
            </span>
            <span className={`${item.isAvailable?'bg-green-100 text-green-800':'bg-red-100 text-red-800'} px-2.5 py-0.5 rounded-full text-xs font-medium`}>
              {item.isAvailable?'Available':'Unavailable'}
            </span>
          </div>
          <span className="text-xs text-gray-500 font-medium">
            {item.condition}
          </span>
        </div>
        
        {onDelete && (
          <Button
            variant="ghost"
            size="icon"
            className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item._id);
            }}
          >
            <Trash2 className="size-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
