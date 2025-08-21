"use client";

import "@/globals.css";
import styles from "./styles.module.css";
import { MainFilter } from "@components/filters/mainFilter";
import { SearchInput } from "@components/searchInput";
import { formatDateTime } from "@utils/formatDateTime";
import React from "react";

interface ObservationTableProps {
  title: string;
  isLoading?: boolean;
  error?: string | null;
  isArchived?: boolean;
  onFetch?: () => void;
  // onDelete?: () => Promise<void>;
  onRestore?: () => Promise<void>;
  showAddButton?: boolean;
  showEditAction?: boolean;
  showDeleteAction?: boolean;
  showIsArchivedAction?: boolean;
}

export const ObservationTable = ({
  title,
  isLoading,
  error,
  isArchived,
  onFetch,
  // onDelete,
  onRestore,
  showAddButton = false,
  showEditAction = false,
  showDeleteAction = false,
  showIsArchivedAction = false,
}: ObservationTableProps) => {
  if (isLoading) {
    return <div>{`Загрузка ${isArchived ? "архива" : "таблицы"} несоответствий...`}</div>;
  }

  if (error) {
    return <div>Ошибка: {error}</div>;
  }

  return (
    <>
      <main>
        <h3>{title}</h3>
        <section className={styles.filterSection}>
          {isArchived ? (
            <SearchInput />
          ) : (
            <>
              <MainFilter />
              <SearchInput />
            </>
          )}
          <button onClick={onFetch}>Получить данные</button>
        </section>

        <section>
          <table>
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
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>
                  <div className={styles.observationActions}>
                    {isArchived && (
                      <>
                        <p>
                          Дата переноса в архив: <br />
                          <b>{formatDateTime(`дата`)}</b>
                        </p>
                      </>
                    )}
                    {showEditAction && (
                      <a
                        href="#"
                        title="Изменить наблюдение может только администратор"
                        className={styles.redText}
                      >
                        Изменить наблюдение
                      </a>
                    )}
                    <a href="#">Добавить комментарий</a>
                    <a href="#">Посмотреть историю комментариев к наблюдению</a>
                    {showIsArchivedAction && (
                      <a
                        href="#"
                        title="Закрыть наблюдение и перенести в архив"
                        className={styles.greenText}
                      >
                        Закрыть наблюдение и перенести в архив
                      </a>
                    )}
                    {showDeleteAction && (
                      <a
                        href="#"
                        title="Удалить несоответствие может только администратор"
                        className={styles.redText}
                      >
                        Удалить наблюдение
                      </a>
                    )}
                    {onRestore && (
                      <a
                        href="#"
                        title="Восстановить несоответствие может только администратор"
                        className={styles.redText}
                      >
                        Восстановить
                      </a>
                    )}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {showAddButton && (
          <section className={styles.addButton}>
            <button>Добавить наблюдение</button>
          </section>
        )}
      </main>
    </>
  );
};

export default React.memo(ObservationTable);
