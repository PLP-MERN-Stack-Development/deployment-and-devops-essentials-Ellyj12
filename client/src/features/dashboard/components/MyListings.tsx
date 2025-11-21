import { ItemCard } from "@/features/items/components/ItemCard";
import type { Item } from "@/features/items/api/item.types";

interface MyListingsProps {
  listings: Item[];
  onDelete: (id: string) => void;
}

export const MyListings = ({ listings, onDelete }: MyListingsProps) => {
  return (
    <section id="myListings">
      <h2 className="text-2xl font-bold mb-4">My Listings</h2>
      {listings.length === 0 ? (
        <p className="text-gray-500">You haven't listed any items yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {listings.map((item) => (
            <ItemCard 
              key={item._id} 
              item={item} 
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </section>
  );
};
