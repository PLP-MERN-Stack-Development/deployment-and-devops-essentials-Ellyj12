import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CircleX, SlidersHorizontal } from "lucide-react";
import { useCategories } from "@/features/items/hooks/useCategories";
import type { Category } from "@/features/items/api/category.types";

interface FilterModalProps {
  onApply?: (filters: {
    categoryIds: string[];
    sortBy: "latest" | "oldest";
    tradeType?: "Trade" | "Free";
    conditions?: string[];
  }) => void;
  initialCategories?: string[];
  initialSortBy?: "latest" | "oldest";
  initialTradeType?: "Trade" | "Free" | "";
  initialConditions?: string[];
}

const FilterModal = ({
  onApply,
  initialCategories = [],
  initialSortBy = "latest",
  initialTradeType = "",
  initialConditions = [],
}: FilterModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategories);
  const [sortBy, setSortBy] = useState<"latest" | "oldest">(initialSortBy);
  const [tradeType, setTradeType] = useState<"Trade" | "Free" | "">(initialTradeType);
  const [selectedConditions, setSelectedConditions] = useState<string[]>(initialConditions);

  useEffect(() => {
    setSelectedCategories(initialCategories);
  }, [initialCategories]);

  useEffect(() => {
    setSortBy(initialSortBy);
  }, [initialSortBy]);

  useEffect(() => {
    setTradeType(initialTradeType || "");
  }, [initialTradeType]);

  useEffect(() => {
    setSelectedConditions(initialConditions);
  }, [initialConditions]);

  const { categories, loading, error } = useCategories();

  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleCondition = (value: string) => {
    setSelectedConditions((prev) =>
      prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value]
    );
  };

  const handleApply = () => {
    onApply?.({
      categoryIds: selectedCategories,
      sortBy,
      tradeType: tradeType || undefined,
      conditions: selectedConditions,
    });
    setIsOpen(false);
  };

  const handleReset = () => {
    setSelectedCategories([]);
    setSortBy("latest");
    setTradeType("");
    setSelectedConditions([]);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading categories</p>;

  return (
    <>
      <button
        className="rounded-md shadow-sm border flex gap-1 cursor-pointer p-1"
        onClick={() => setIsOpen(true)}
      >
        <SlidersHorizontal />
        Filters
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setIsOpen(false)} 
          >
            <motion.div
              className="rounded-md w-11/12 md:w-3/4 max-w-2xl max-h-[85vh] overflow-y-auto border bg-white p-6 relative shadow-xl"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-3 right-3"
                onClick={() => setIsOpen(false)}
              >
                <CircleX />
              </button>

              {/* Sort Section */}
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Sort by</h3>

                <div className="flex gap-3">
                  {["latest", "oldest"].map((s) => (
                    <button
                      key={s}
                      onClick={() => setSortBy(s as "latest" | "oldest")}
                      className={`px-3 py-1 rounded border text-sm capitalize ${
                        sortBy === s
                          ? "bg-blue-500 text-white border-blue-500"
                          : "bg-white border-gray-300"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Trade Type */}
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Trade type</h3>
                <div className="flex gap-3 flex-wrap">
                  {[
                    { label: "Any", value: "" },
                    { label: "Trade", value: "Trade" },
                    { label: "Free", value: "Free" },
                  ].map((option) => (
                    <button
                      key={option.label}
                      onClick={() => setTradeType(option.value as "Trade" | "Free" | "")}
                      className={`px-3 py-1 rounded border text-sm capitalize ${
                        tradeType === option.value
                          ? "bg-blue-500 text-white border-blue-500"
                          : "bg-white border-gray-300"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold mb-2">Condition</h3>
                <div className="flex gap-2 flex-wrap">
                  {["New", "Like New", "Used", "Damaged"].map((condition) => (
                    <label
                      key={condition}
                      className={`px-3 py-1 rounded border text-sm cursor-pointer ${
                        selectedConditions.includes(condition)
                          ? "bg-blue-500 text-white border-blue-500"
                          : "bg-white border-gray-300"
                      }`}
                      onClick={() => toggleCondition(condition)}
                    >
                      {condition}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Categories</h3>

                <div className="flex flex-wrap gap-2">
                  {categories.map((c: Category) => (
                    <label
                      key={c._id}
                      className="flex items-center gap-2 border px-3 py-1 rounded cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(c._id)}
                        onChange={() => toggleCategory(c._id)}
                      />
                      {c.name}
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleReset}
                  className="flex-1 border py-2 rounded"
                >
                  Reset
                </button>

                <button
                  onClick={handleApply}
                  className="flex-1 bg-blue-600 text-white py-2 rounded"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FilterModal;
