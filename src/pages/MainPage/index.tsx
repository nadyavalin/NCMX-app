import styles from "./styles.module.css";
import { StatisticCard } from "./statisticCard";

export const MainPage = () => {
  return (
    <>
      <main>
        <h1>Динамика закрытия несоответствий / наблюдений / возможностей для улучшения</h1>
        <div className={styles.cards}>
          <StatisticCard title="Несоответствия (открытые)" />
          <StatisticCard title="Наблюдения (открытые)" />
          <StatisticCard title="Возможности для улучшения (открытые)" />
        </div>

        <div className={styles.cards}>
          <StatisticCard title="Закрыто несоответствий в 2025" />
          <StatisticCard title="Закрыто наблюдений в 2025" />
          <StatisticCard title="Закрыто возможностей для улучшения в 2025" />
        </div>

        <div className={styles.cards}>
          <StatisticCard title="Закрыто несоответствий всего" />
          <StatisticCard title="Закрыто наблюдений всего" />
          <StatisticCard title="Закрыто возможностей для улучшения всего" />
        </div>
      </main>
    </>
  );
};
