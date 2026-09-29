"use client";

import styles from "./styles.module.css";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@store/store";
import { setFilter } from "@store/uiSlice";

export const SearchInput = () => {
  const dispatch = useDispatch<AppDispatch>();
  const search = useSelector((state: RootState) => state.ui.filters.search);

  return (
    <input
      type="text"
      className={styles.searchInput}
      placeholder="Поиск по всем полям..."
      value={search}
      onChange={(e) => dispatch(setFilter({ key: "search", value: e.target.value }))}
    />
  );
};
