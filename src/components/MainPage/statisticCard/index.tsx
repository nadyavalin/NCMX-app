import styles from "./styles.module.css";

export const StatisticCard = ({ title }: { title: string }) => {
  return (
    <div className={styles.card}>
      <h4>{title}</h4>
      <div className={styles.innerCardText}>
        <p className={styles.innerCardTitle}>
          Общее количество: <b>68</b>
        </p>
        <div className={styles.innerCardDepartments}>
          <p>
            <span>НПГС:</span>
            <span className={styles.dotted}></span>
            <b>9</b>
          </p>
          <p>
            <span>ППГС:</span>
            <span className={styles.dotted}></span>
            <b>8</b>
          </p>
          <p>
            <span>НПО:</span>
            <span className={styles.dotted}></span>
            <b>0</b>
          </p>
          <p>
            <span>ПП СОК</span>
            <span className={styles.dotted}></span>
            <b>5</b>
          </p>
          <p>
            <span>ПП ФЭИС:</span>
            <span className={styles.dotted}></span>
            <b>27</b>
          </p>
          <p className={styles.statisticLink}>
            <a href="#">Посмотреть статистику по всем подразделениям</a>
          </p>
        </div>
      </div>
    </div>
  );
};
