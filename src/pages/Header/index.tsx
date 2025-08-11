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
          <div className={styles.auditMenuArea}>
            <p className={styles.auditTitle}>Внешние аудиты</p>
            <Link href={`/OuterAudits/Inconsistencies`} className="menuButton">
              Несоответствия
            </Link>
            <Link href={`/OuterAudits/Observations`} className="menuButton">
              Наблюдения
            </Link>
            <Link href={`/OuterAudits/Improvements`} className="menuButton">
              Возможности для улучшения
            </Link>
            <Link href={`/OuterAudits/Archive`} className="menuButton">
              Архив
            </Link>
          </div>
          <div className={styles.auditMenuArea}>
            <p className={styles.auditTitle}>Внутренние аудиты</p>
            <Link href={`/InnerAudits/Inconsistencies`} className="menuButton">
              Несоответствия
            </Link>
            <Link href={`/InnerAudits/Observations`} className="menuButton">
              Наблюдения
            </Link>
            <Link href={`/InnerAudits/Improvements`} className="menuButton">
              Возможности для улучшения
            </Link>
            <Link href={`/InnerAudits/Archive`} className="menuButton">
              Архив
            </Link>
          </div>
        </nav>
      </header>
    </>
  );
};
