"use client";

import Link from "next/link";
import styles from "./styles.module.css";

export const Header = () => {
  return (
    <>
      <header>
        <nav className={styles.navMenu}>
          <Link href={`/`} className="menuButton">
            Главная
          </Link>
          <Link href={`/Inconsistencies`} className="menuButton">
            Несоответствия
          </Link>
          <Link href={`/Observations`} className="menuButton">
            Наблюдения
          </Link>
          <Link href={`/Improvements`} className="menuButton">
            Возможности для улучшения
          </Link>
          <Link href={`/Archive`} className="menuButton">
            Архив
          </Link>
        </nav>
      </header>
    </>
  );
};
