import Link from "next/link";
import styles from "./styles.module.css";

export const Header = () => {
  return (
    <>
      <main>
        <nav className={styles.navMenu}>
          <Link href={`/`} className={styles.menuButton}>
            Главная
          </Link>
          <Link href={`/Inconsistencies`} className={styles.menuButton}>
            Несоответствия
          </Link>
          <Link href={`/Observations`} className={styles.menuButton}>
            Наблюдения
          </Link>
          <Link href={`/Improvements`} className={styles.menuButton}>
            Возможности для улучшения
          </Link>
        </nav>
      </main>
    </>
  );
};
