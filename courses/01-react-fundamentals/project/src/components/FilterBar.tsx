import { useRef, useEffect } from "react";
import Button from "./Button";
import FormInput from "./FormInput";

type Filter = "all" | "active" | "completed";

interface FilterBarProps {
  filter: Filter;
  onFilterChange: (filter: Filter) => void;
  sortOrder: string;
  onSortChange: (value: string) => void;

  searchText?: string;
  onSearchChange?: (value: string) => void;
  onClearSearch?: () => void;

  isSearching?: boolean;

  categoryFilter?: string;
  onCategoryChange?: (category: string) => void;
  categories?: string[];
}

function FilterBar({
  filter,
  onFilterChange,
  sortOrder,
  onSortChange,
  searchText = "",
  onSearchChange,
  onClearSearch,
  isSearching = false,
  categoryFilter = "all",
  onCategoryChange,
  categories = [],
}: FilterBarProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  return (
    <div id="filter-bar">
      <Button
        variant={filter === "all" ? "primary" : "secondary"}
        dataActive={filter === "all"}
        onClick={() => onFilterChange("all")}
      >
        All
      </Button>

      <Button
        variant={filter === "active" ? "primary" : "secondary"}
        dataActive={filter === "active"}
        onClick={() => onFilterChange("active")}
      >
        Active
      </Button>

      <Button
        variant={filter === "completed" ? "primary" : "secondary"}
        dataActive={filter === "completed"}
        onClick={() => onFilterChange("completed")}
      >
        Completed
      </Button>

      <select
        id="sort-order"
        value={sortOrder}
        onChange={(e) => onSortChange(e.target.value)}
      >
        <option value="recent">Recently Added</option>
        <option value="high">Priority: High to Low</option>
        <option value="low">Priority: Low to High</option>
        <option value="alphabetical">Alphabetical</option>
        <option value="dueDate">Due Date (Soonest First)</option>
      </select>

      <select
        id="category-filter"
        value={categoryFilter}
        onChange={(e) => onCategoryChange?.(e.target.value)}
      >
        <option value="all">All categories</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      <FormInput
        id="search-input"
        type="text"
        placeholder="Search tasks..."
        value={searchText}
        onChange={(e) => onSearchChange?.(e.target.value)}
        inputRef={searchInputRef}
      />

      {isSearching && (
        <span id="searching-indicator">Searching...</span>
      )}

      {searchText.trim() !== "" && (
        <Button
          id="clear-search"
          type="button"
          variant="secondary"
          onClick={() => onClearSearch?.()}
        >
          Clear search
        </Button>
      )}
    </div>
  );
}

export default FilterBar;