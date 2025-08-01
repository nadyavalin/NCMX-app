import "@/globals.css";
import styles from "./styles.module.css";

export const SearchInput = () => {
  return <input type="text" className={styles.searchInput} placeholder="Поиск по всем полям..." />;
};
