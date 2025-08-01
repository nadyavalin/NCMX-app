import "@/globals.css";
import styles from "./styles.module.css";

export const ArchiveObservations = () => {
  return (
    <>
      <main className={styles.main}>
        <h3>
          Архив наблюдений по результатам внутренних аудитов СМК и внутренних технологических
          аудитов
        </h3>
        <section className={styles.filterSection}>
          <input type="text" placeholder="Поиск..." />
          <button>Получить данные</button>
        </section>

        <section className="observationsTableSection">
          <table className="observationsTable">
            <thead>
              <tr>
                <th>ID</th>
                <th>№</th>
                <th>Ссылки на пункты ISO 9001 / 80079-34 / НД</th>
                <th>Описание наблюдения</th>
                <th>Источник информации о несоответствии</th>
                <th>Подразделение / участок / место обнаружения наблюдения</th>
                <th>Решения</th>
                <th>Ответственный за выполнение</th>
                <th>Срок реализации</th>
                <th>Действия с наблюдением</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>...</td>
                <td>...</td>
                <td>...</td>
                <td>...</td>
                <td>...</td>
                <td>...</td>
                <td>...</td>
                <td>...</td>
                <td>...</td>
                <td>
                  <div className={styles.observationActions}>
                    <a href="#">Посмотреть историю комментариев к наблюдению</a>
                    <a
                      href="#"
                      title="Восстановить наблюдение может только администратор"
                      className={styles.redText}
                    >
                      Восстановить
                    </a>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </main>
    </>
  );
};
