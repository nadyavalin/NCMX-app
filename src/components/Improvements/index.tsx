"use client";

import "@/globals.css";
import styles from "./styles.module.css";
import { MainFilter } from "@components/filters/mainFilter";
import { SearchInput } from "@components/searchInput";

export const Improvements = () => {
  return (
    <>
      <main>
        <h3>
          Реестр возможностей для улучшения по результатам внутренних аудитов СМК и внутренних
          технологических аудитов
        </h3>
        <section className={styles.filterSection}>
          <MainFilter />
          <SearchInput />
          <button>Получить данные</button>
        </section>

        <section className="improvementsTableSection">
          <table className="improvementsTable">
            <thead>
              <tr>
                <th>ID</th>
                <th>№</th>
                <th>Ссылки на пункты ISO 9001 / 80079-34 / НД</th>
                <th>Описание возможности для улучшения</th>
                <th>Источник информации о несоответствии</th>
                <th>Ответственный за реализацию</th>
                <th>Срок реализации</th>
                <th>Действия с возможностью для улучшения</th>
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
                <td>
                  <div className={styles.observationActions}>
                    <a href="#">Добавить комментарий</a>
                    <a href="#">Посмотреть историю комментариев к возможности для улучшения</a>
                    <a href="#">Закрыть возможность для улучшения и перенести в архив</a>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className={styles.addButton}>
          <button>Добавить возможность для улучшения</button>
        </section>
      </main>
    </>
  );
};
