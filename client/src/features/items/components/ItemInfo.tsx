import type { Item } from "../api/item.types";
import { MapPin, Calendar, Tag, ArrowLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ItemInfoProps {
  item: Item;
  isOwner: boolean;
  onSwapRequest: () => void;
}

export function ItemInfo({ item, isOwner, onSwapRequest }: ItemInfoProps) {
  const categoryName =
    typeof item.category === "object" ? item.category.name : item.category;
  const desiredCategoryName =
    item.desiredCategory && typeof item.desiredCategory === "object"
      ? item.desiredCategory.name
      : item.desiredCategory;

  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-start">
          <h1 className="text-3xl font-bold text-gray-900">{item.name}</h1>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              item.type === "Free"
                ? "bg-green-100 text-green-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {item.type || "Trade"}
          </span>
        </div>
        <p className="text-gray-500 mt-2 flex items-center gap-2">
          <MapPin className="size-4" />{" "}
          {item.location ? "Location Available" : "No Location"}
          <span className="mx-2">•</span>
          <Calendar className="size-4" /> Listed{" "}
          {new Date(item.createdAt).toLocaleDateString()}
        </p>
      </div>

      <div className="bg-white p-4 rounded-lg border shadow-sm space-y-3">
        <div className="flex justify-between border-b border-gray-100 pb-2">
          <span className="text-gray-500">Condition</span>
          <span className="font-medium text-gray-900">{item.condition}</span>
        </div>
        <div className="flex justify-between border-b border-gray-100 pb-2">
          <span className="text-gray-500">Category</span>
          <span className="font-medium text-gray-900">{categoryName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Owner</span>
          <span className="font-medium text-gray-900">
            {item.owner.username}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Status</span>
          <span className="font-medium text-gray-900">
            {item.isAvailable ? 'Available' : 'Unavailable'}
          </span>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-2 text-gray-900">
          Description
        </h3>
        <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
          {item.description}
        </p>
      </div>

      {(item.desiredItem || desiredCategoryName) && (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <Tag className="size-4" /> Looking For
          </h3>
          <p className="text-blue-800">
            {item.desiredItem && (
              <span className="block">• {item.desiredItem}</span>
            )}
            {desiredCategoryName && (
              <span className="block">
                • Items in {desiredCategoryName} category
              </span>
            )}
          </p>
        </div>
      )}

      <div className="pt-4">
        {isOwner ? (
          <Button
            className="w-full py-6 text-lg bg-gray-100 text-gray-400 border-gray-200"
            variant="outline"
            disabled
          >
            This is your listing
          </Button>
        ) : (
          <Button
            className="w-full py-6 text-lg bg-green-600 hover:bg-green-700 text-white shadow-sm"
            onClick={onSwapRequest}
          >
            <ArrowLeftRight className="mr-2 size-5" />
            Request Swap
          </Button>
        )}
      </div>
    </div>
  );
}
