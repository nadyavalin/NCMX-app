"use client";

import "@/globals.css";
import styles from "./styles.module.css";
import { MainFilter } from "@components/filters/mainFilter";
import { SearchInput } from "@components/searchInput";

export const Observations = () => {
  return (
    <>
      <main>
        <h3>
          Реестр наблюдений по результатам внутренних аудитов СМК и внутренних технологических
          аудитов
        </h3>
        <section className={styles.filterSection}>
          <MainFilter />
          <SearchInput />
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
                    <a href="#">Добавить комментарий</a>
                    <a href="#">Посмотреть историю комментариев к наблюдению</a>
                    <a href="#" className={styles.close}>
                      Закрыть наблюдение и перенести в архив
                    </a>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className={styles.addButton}>
          <button>Добавить наблюдение</button>
        </section>
      </main>
    </>
  );
};
