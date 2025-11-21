import type { Item } from "../api/item.types";
import { ItemCard } from "./ItemCard";
import { Link } from "react-router-dom";

interface ItemsGridProps {
  items: Item[];
}

export function ItemsGrid({ items }: ItemsGridProps) {
  if (items.length === 0) {
    return <div>No items found.</div>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
      {items.map((item) => (
        <Link to={`/items/${item._id}`} key={item._id} className="block h-full">
          <ItemCard item={item} />
        </Link>
      ))}
    </div>
  );
}
