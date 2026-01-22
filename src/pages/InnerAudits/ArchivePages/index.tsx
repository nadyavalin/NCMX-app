import "@/globals.css";
import styles from "./styles.module.css";
import Link from "next/link";

export const Archive = () => {
  return (
    <>
      <main>
        <nav className={styles.archiveList}>
          <Link
            href={`/InnerAudits/Archive/ArchiveNonconformities`}
            title="Архив несоответствий"
            className={`${styles.archiveButton} menuButton`}
          >
            Архив несоответствий
          </Link>
          <Link
            href={`/InnerAudits/Archive/ArchiveObservations`}
            title="Архив несоответствий"
            className={`${styles.archiveButton} menuButton`}
          >
            Архив наблюдений
          </Link>
          <Link
            href={`/InnerAudits/Archive/ArchiveImprovements`}
            title="Архив несоответствий"
            className={`${styles.archiveButton} menuButton`}
          >
            Архив возможностей для улучшения
          </Link>
        </nav>
      </main>
    </>
  );
};
