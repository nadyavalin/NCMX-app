"use client";

import "@/globals.css";
import styles from "./styles.module.css";
import { MainFilter } from "@components/lists/headFilters/MainFilter";
import { SearchInput } from "@components/SearchInput";
import { formatDateTime } from "@utils/formatDateTime";
import React, { useState } from "react";
import ObservationAdderModal from "@modals/ObservationAdderModal";
import { ObservationResponseGET } from "@appTypes/types";

interface ObservationTableProps {
  title: string;
  observations?: ObservationResponseGET[];
  isLoading?: boolean;
  error?: string | null;
  isArchived?: boolean;
  onFetch?: () => void;
  onDelete?: (num_observation: number) => Promise<void>;
  onRestore?: (num_observation: number) => Promise<void>;
  showAddButton?: boolean;
  showEditAction?: boolean;
  showDeleteAction?: boolean;
  showIsArchivedAction?: boolean;
}

export const ObservationTable = ({
  title,
  observations = [],
  isLoading,
  error,
  isArchived,
  onFetch,
  onDelete,
  onRestore,
  showAddButton = true,
  showEditAction = false,
  showDeleteAction = false,
  showIsArchivedAction = false,
}: ObservationTableProps) => {
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [editItem, setEditItem] = useState<ObservationResponseGET | null>(null);

  const openModal = (item?: ObservationResponseGET) => {
    setEditItem(item || null);
    setIsModalEditOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalEditOpen(false);
    setEditItem(null);
  };

  const handleEdit = (item: ObservationResponseGET) => {
    openModal(item);
  };

  const handleDelete = async (num_observation: number) => {
    if (onDelete && confirm("Вы уверены, что хотите удалить это наблюдение?")) {
      await onDelete(num_observation);
    }
  };

  const handleRestore = async (num_observation: number) => {
    if (onRestore && confirm("Вы уверены, что хотите восстановить это наблюдение?")) {
      await onRestore(num_observation);
    }
  };

  const handleArchive = async (num_observation: number) => {
    // Здесь будет логика архивации через API
    console.log("Archive observation:", num_observation);
  };

  if (isLoading) {
    return <div>{`Загрузка ${isArchived ? "архива" : "таблицы"} наблюдений...`}</div>;
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
          {onFetch && <button onClick={onFetch}>Получить данные</button>}
        </section>

        <section>
          <table>
            <thead>
              <tr>
                <th>№</th>
                <th>Ссылки на пункты ISO 9001 / 80079-34 / НД</th>
                <th>Описание наблюдения</th>
                <th>Источник информации о наблюдении</th>
                <th>Решения</th>
                <th>Ответственный за выполнение</th>
                <th>Срок реализации</th>
                <th>Действия с наблюдением</th>
              </tr>
            </thead>
            <tbody>
              {observations.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: "center" }}>
                    {isArchived ? "Архив наблюдений пуст" : "Нет наблюдений"}
                  </td>
                </tr>
              ) : (
                observations.map((observation) => (
                  <tr key={observation.num_observation}>
                    <td>{observation.num_observation}</td>
                    <td>
                      {observation.normative_documents?.map((doc, index) => (
                        <p key={index}>
                          - {doc.norm_doc || "-"} {doc.point || "-"}
                        </p>
                      ))}
                    </td>
                    <td>{observation.observation}</td>
                    <td>
                      {observation.report}
                      {observation.report_date && (
                        <div>
                          <small>{formatDateTime(observation.report_date)}</small>
                        </div>
                      )}
                    </td>
                    <td>
                      {observation.solutions?.map((sol, index) => (
                        <p key={index} className={styles.solText}>
                          {index + 1}. {sol.solution || "-"}
                        </p>
                      ))}
                    </td>
                    <td>
                      {observation.solutions?.map((sol, index) => (
                        <div key={index}>
                          <p>{index + 1}.</p>
                          {sol.responsible_for_solution?.map((resp, respIndex) => (
                            <p key={respIndex} className={styles.solText}>
                              {resp.department || "-"}: {resp.person || "-"}
                            </p>
                          ))}
                        </div>
                      ))}
                    </td>
                    <td>
                      {observation.solutions?.map((sol, index) => (
                        <div key={index} className={styles.solText}>
                          {index + 1}. {sol.solution_date && formatDateTime(sol.solution_date)}
                        </div>
                      ))}
                    </td>
                    <td>
                      <div className={styles.observationActions}>
                        {isArchived && observation.observation_closure_date && (
                          <p>
                            Дата переноса в архив: <br />
                            <b>{formatDateTime(observation.observation_closure_date)}</b>
                          </p>
                        )}

                        {showEditAction && (
                          <a
                            href="#"
                            className={styles.redText}
                            onClick={(e) => {
                              e.preventDefault();
                              handleEdit(observation);
                            }}
                          >
                            Изменить наблюдение
                          </a>
                        )}

                        <a href="#">Добавить комментарий</a>
                        <a href="#">Посмотреть историю комментариев к наблюдению</a>

                        {showIsArchivedAction && !isArchived && (
                          <a
                            href="#"
                            title="Закрыть наблюдение и перенести в архив"
                            className={styles.greenText}
                            onClick={(e) => {
                              e.preventDefault();
                              handleArchive(observation.num_observation);
                            }}
                          >
                            Закрыть наблюдение и перенести в архив
                          </a>
                        )}

                        {showDeleteAction && (
                          <a
                            href="#"
                            title="Удалить наблюдение может только администратор"
                            className={styles.redText}
                            onClick={(e) => {
                              e.preventDefault();
                              handleDelete(observation.num_observation);
                            }}
                          >
                            Удалить наблюдение
                          </a>
                        )}

                        {isArchived && onRestore && (
                          <a
                            href="#"
                            className={styles.redText}
                            onClick={(e) => {
                              e.preventDefault();
                              handleRestore(observation.num_observation);
                            }}
                          >
                            Восстановить
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>

        {showAddButton && !isArchived && (
          <section className={styles.addButton}>
            <button onClick={() => openModal()}>Добавить наблюдение</button>
            <ObservationAdderModal
              isOpen={isModalEditOpen}
              onClose={handleCloseModal}
              editItem={editItem}
            />
          </section>
        )}
      </main>
    </>
  );
};

export default React.memo(ObservationTable);
