import type { Item } from "../api/item.types";

interface ItemImageGalleryProps {
  item: Item;
}

export function ItemImageGallery({ item }: ItemImageGalleryProps) {
  return (
    <div className="space-y-4">
      <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden border shadow-sm">
        {item.images && item.images.length > 0 ? (
          <img
            src={item.images[0]}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image Available
          </div>
        )}
      </div>
      {/* Thumbnails if multiple images */}
      {item.images && item.images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {item.images.slice(1).map((img, idx) => (
            <div
              key={idx}
              className="aspect-square bg-gray-100 rounded-lg overflow-hidden border"
            >
              <img
                src={img}
                alt={`${item.name} ${idx + 2}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
