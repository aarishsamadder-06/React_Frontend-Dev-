type Filter = "all" | "active" | "completed";

interface FilterBarProps {
  filter: Filter;
  onFilterChange: (filter: Filter) => void;
  sortOrder: string;
  onSortChange: (value: string) => void;

  // Challenge 09
  searchText?: string;
  onSearchChange?: (value: string) => void;
  onClearSearch?: () => void;

  // Challenge 11
  isSearching?: boolean;

  // Challenge 12
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
  return (
    <div id="filter-bar">
      <button
        data-active={filter === "all"}
        onClick={() => onFilterChange("all")}
      >
        All
      </button>

      <button
        data-active={filter === "active"}
        onClick={() => onFilterChange("active")}
      >
        Active
      </button>

      <button
        data-active={filter === "completed"}
        onClick={() => onFilterChange("completed")}
      >
        Completed
      </button>

      <select
        id="sort-order"
        value={sortOrder}
        onChange={(e) => onSortChange(e.target.value)}
      >
        <option value="recent">Recently Added</option>
        <option value="high">Priority: High to Low</option>
        <option value="low">Priority: Low to High</option>
        <option value="alphabetical">Alphabetical</option>
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

      <input
        id="search-input"
        type="text"
        placeholder="Search tasks..."
        value={searchText}
        onChange={(e) => onSearchChange?.(e.target.value)}
      />

      {isSearching && (
        <span id="searching-indicator">Searching...</span>
      )}

      {searchText.trim() !== "" && (
        <button
          id="clear-search"
          type="button"
          onClick={() => onClearSearch?.()}
        >
          Clear search
        </button>
      )}
    </div>
  );
}

export default FilterBar;