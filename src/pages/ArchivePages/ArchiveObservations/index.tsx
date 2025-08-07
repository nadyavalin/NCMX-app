import "@/globals.css";
import styles from "../styles.module.css";
import ObservationTable from "@components/ObservationTable";

export const ArchiveObservations = () => {
  return (
    <>
      <main>
        <div className={styles.archiveBlock}>
          <ObservationTable title="Архив наблюдений по результатам внутренних аудитов СМК и внутренних технологических аудитов" />
        </div>
      </main>
    </>
  );
};
