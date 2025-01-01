import styles from "./styles.module.css";

export const MainPage = () => {
  return (
    <>
      <main>
        <h3>Из реестра внутренних аудитов</h3>
        <div className={styles.cards}>
          <div className={styles.card}>
            <h4>Несоответствия</h4>
            <div className={styles.innerCardText}>
              <p className={styles.innerCardTitles}>Общее количество:</p>
              <p className={styles.innerCardTitles}>Количество в каждом подразделении:</p>
              <div className={styles.innerCardDepartments}>
                <p>НПГС:</p>
                <p>ППГС:</p>
                <p>НПО:</p>
                <p>ПП СОК:</p>
                <p>ПП ФЭИС:</p>
                <p>...</p>
              </div>
            </div>
          </div>
          <div className={styles.card}>
            <h4>Наблюдения</h4>
            <p className={styles.innerCardTitles}>Общее количество:</p>
            <p className={styles.innerCardTitles}>Количество в каждом подразделении:</p>
            <div className={styles.innerCardDepartments}>
              <p>НПГС:</p>
              <p>ППГС:</p>
              <p>НПО:</p>
              <p>ПП СОК:</p>
              <p>ПП ФЭИС:</p>
              <p>...</p>
            </div>
          </div>
          <div className={styles.card}>
            <h4>Возможности для улучшения</h4>
            <p className={styles.innerCardTitles}>Общее количество:</p>
            <p className={styles.innerCardTitles}>Количество в каждом подразделении:</p>
            <div className={styles.innerCardDepartments}>
              <p>НПГС:</p>
              <p>ППГС:</p>
              <p>НПО:</p>
              <p>ПП СОК:</p>
              <p>ПП ФЭИС:</p>
              <p>...</p>
            </div>
          </div>
        </div>

        <div className={styles.cards}>
          <div className={styles.card}>
            <h4>Закрыто несоответствий в 2024</h4>
            <div className={styles.innerCardText}>
              <p className={styles.innerCardTitles}>Общее количество:</p>
              <p className={styles.innerCardTitles}>Количество в каждом подразделении:</p>
              <div className={styles.innerCardDepartments}>
                <p>НПГС:</p>
                <p>ППГС:</p>
                <p>НПО:</p>
                <p>ПП СОК:</p>
                <p>ПП ФЭИС:</p>
                <p>...</p>
              </div>
            </div>
          </div>
          <div className={styles.card}>
            <h4>Закрыто наблюдений в 2024</h4>
            <p className={styles.innerCardTitles}>Общее количество:</p>
            <p className={styles.innerCardTitles}>Количество в каждом подразделении:</p>
            <div className={styles.innerCardDepartments}>
              <p>НПГС:</p>
              <p>ППГС:</p>
              <p>НПО:</p>
              <p>ПП СОК:</p>
              <p>ПП ФЭИС:</p>
              <p>...</p>
            </div>
          </div>
          <div className={styles.card}>
            <h4>Закрыто возможностей для улучшения в 2024</h4>
            <p className={styles.innerCardTitles}>Общее количество:</p>
            <p className={styles.innerCardTitles}>Количество в каждом подразделении:</p>
            <div className={styles.innerCardDepartments}>
              <p>НПГС:</p>
              <p>ППГС:</p>
              <p>НПО:</p>
              <p>ПП СОК:</p>
              <p>ПП ФЭИС:</p>
              <p>...</p>
            </div>
          </div>
        </div>

        <div className={styles.cards}>
          <div className={styles.card}>
            <h4>Закрыто несоответствий всего</h4>
            <div className={styles.innerCardText}>
              <p className={styles.innerCardTitles}>Общее количество:</p>
              <p className={styles.innerCardTitles}>Количество в каждом подразделении:</p>
              <div className={styles.innerCardDepartments}>
                <p>НПГС:</p>
                <p>ППГС:</p>
                <p>НПО:</p>
                <p>ПП СОК:</p>
                <p>ПП ФЭИС:</p>
                <p>...</p>
              </div>
            </div>
          </div>
          <div className={styles.card}>
            <h4>Закрыто наблюдений всего</h4>
            <p className={styles.innerCardTitles}>Общее количество:</p>
            <p className={styles.innerCardTitles}>Количество в каждом подразделении:</p>
            <div className={styles.innerCardDepartments}>
              <p>НПГС:</p>
              <p>ППГС:</p>
              <p>НПО:</p>
              <p>ПП СОК:</p>
              <p>ПП ФЭИС:</p>
              <p>...</p>
            </div>
          </div>
          <div className={styles.card}>
            <h4>Закрыто возможностей для улучшения всего</h4>
            <p className={styles.innerCardTitles}>Общее количество:</p>
            <p className={styles.innerCardTitles}>Количество в каждом подразделении:</p>
            <div className={styles.innerCardDepartments}>
              <p>НПГС:</p>
              <p>ППГС:</p>
              <p>НПО:</p>
              <p>ПП СОК:</p>
              <p>ПП ФЭИС:</p>
              <p>...</p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};
