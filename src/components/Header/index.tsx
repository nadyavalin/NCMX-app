"use client";

import Link from "next/link";
import styles from "./styles.module.css";

export const Header = () => {
  return (
    <>
      <header>
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
          <Link href={`/Archive`} className={styles.menuButton}>
            Архив
          </Link>
        </nav>
      </header>
    </>
  );
};
