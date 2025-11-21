import { useState } from "react";
import FilterModal from "./filterModal";
import Logo from "./Logo";
import SearchBar from "./SearchBar";
import UserMenu from "./UserMenu";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Menu } from "lucide-react";
import CollapsedNavbar from "./CollapsedNavbar";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleClick = () => setIsOpen((prev) => !prev);

  // Read current params
  const currentSearch = searchParams.get("search") || "";
  const currentCategories = searchParams.get("category")?.split(",").filter(Boolean) || [];
  const currentConditions = searchParams.get("condition")?.split(",").filter(Boolean) || [];
  const currentSortBy = (searchParams.get("sortBy") as "latest" | "oldest") || "latest";
  const currentTradeType = (searchParams.get("type") as "Trade" | "Free" | null) || "";

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);

    if (term) params.set("search", term);
    else params.delete("search");

    navigate(`/items?${params.toString()}`);
  };

  const handleApplyFilters = (filters: {
    categoryIds: string[];
    sortBy: "latest" | "oldest";
    tradeType?: "Trade" | "Free";
    conditions?: string[];
  }) => {
    const params = new URLSearchParams(searchParams);

    if (filters.categoryIds.length > 0) {
      params.set("category", filters.categoryIds.join(","));
    } else {
      params.delete("category");
    }

    params.set("sortBy", filters.sortBy);

    if (filters.tradeType) params.set("type", filters.tradeType);
    else params.delete("type");

    if (filters.conditions?.length) {
      params.set("condition", filters.conditions.join(","));
    } else {
      params.delete("condition");
    }

    navigate(`/items?${params.toString()}`);
  };

  return (
    <nav className="p-2 px-4 md:px-5 flex border-b fixed top-0 w-full bg-white items-center gap-2 md:gap-4 z-50">
      <Logo />

      <div className="flex-1 flex items-center gap-2 mx-4">
        <SearchBar onSearch={handleSearch} initialValue={currentSearch} />
        <FilterModal
          onApply={handleApplyFilters}
          initialCategories={currentCategories}
          initialSortBy={currentSortBy}
          initialTradeType={currentTradeType}
          initialConditions={currentConditions}
        />
      </div>

      <UserMenu />

      <Menu onClick={handleClick} className="cursor-pointer block sm:hidden"  />

      <CollapsedNavbar isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </nav>
  );
};

export default Navbar;
