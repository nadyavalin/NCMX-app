import { ChangeEvent } from "react";
import styles from "./styles.module.css";

interface SearchFilterProps<T> {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  items: T[];
  setFilteredItems: (items: T[]) => void;
  searchFields: Array<keyof T>;
  placeholder?: string;
}

export const SearchFilter = <T,>({
  searchQuery,
  setSearchQuery,
  items,
  setFilteredItems,
  searchFields,
  placeholder = "Поиск по всем полям...",
}: SearchFilterProps<T>) => {
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);

    console.log("SearchFilter: handleSearchChange", { query, itemsLength: items.length });

    const trimmedQuery = query.toLowerCase().trim();
    if (!trimmedQuery) {
      setFilteredItems(items);
      return;
    }

    const filtered = items.filter((item) =>
      searchFields.some((field) => {
        const value = item[field];
        return value != null && String(value).toLowerCase().includes(trimmedQuery);
      }),
    );
    setFilteredItems(filtered);
  };

  return (
    <input
      type="text"
      placeholder={placeholder}
      value={searchQuery}
      onChange={handleSearchChange}
      className={styles.searchInput}
    />
  );
};
