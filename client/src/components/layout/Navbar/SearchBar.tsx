import { useState } from "react";
import type { SearchBarProps } from "../../../features/items/api/item.types";
import { Search } from "lucide-react";

const SearchBar = ({ onSearch, initialValue }: SearchBarProps) => {
  const [term, setTerm] = useState(initialValue || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(term);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full relative">
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" strokeWidth={2.5} />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 sm:py-2 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm text-sm md:text-sm"
            placeholder="Search..."
            value={term}
            onChange={(e) => setTerm(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="hidden sm:block px-2 py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200 text-sm whitespace-nowrap"
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
