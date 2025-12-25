"use client";

import "@/globals.css";
import styles from "./styles.module.css";
import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@store/store";
import {
  setCurrentObservationNumber,
  toggleModalComments,
  toggleModalHistoryComments,
  toggleModalEdit,
  toggleModalRescheduleComments,
} from "@store/uiSlice";
import { MainFilter } from "@components/lists/headFilters/MainFilter";
import { SearchInput } from "@components/SearchInput";
import { formatDateTime } from "@utils/formatDateTime";
import ObservationAdderModal from "@modals/ObservationAdderModal";
import { ObservationResponseGET, SnackbarType } from "@appTypes/types";
import { ConfirmDeleteModal } from "@modals/ConfirmDeleteModal";
import { useSnackbar } from "@components/Snackbar/snackbarContext";
import CommentsAdderModal from "@modals/CommentsAdderModal";
import { formatDate } from "@utils/formatDate";
import { updateObservationRequest } from "@/api";
import RescheduleCommentsAdderModal from "@modals/RescheduleCommentsAdderModal";

interface ObservationTableProps {
  title: string;
  observations: ObservationResponseGET[];
  isLoading: boolean;
  error: string | null;
  isArchived: boolean;
  onFetch: () => void;
  onDelete?: (num_observation: number) => Promise<void>;
  onRestore?: (num_observation: number) => Promise<void>;
  onArchive?: (num_observation: number) => Promise<void>;
  showAddButton?: boolean;
  showEditAction?: boolean;
  showDeleteAction?: boolean;
  showArchiveAction?: boolean;
}

export const ObservationTable = ({
  title,
  observations: observations,
  isLoading,
  error,
  isArchived,
  onFetch,
  onDelete,
  onRestore,
  showAddButton = true,
  showEditAction = false,
  showDeleteAction = false,
  showArchiveAction = true,
}: ObservationTableProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const addSnackbar = useSnackbar();
  const { currentObservationNumber, isModalCommentsOpen, isModalEditOpen } = useSelector(
    (state: RootState) => state.ui,
  );
  const [rescheduleModalData, setRescheduleModalData] = useState<{
    isOpen: boolean;
    objectId: number | null;
  }>({
    isOpen: false,
    objectId: null,
  });
  const [editItem, setEditItem] = useState<ObservationResponseGET | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState<boolean>(false);
  const [deleteNumObservation, setDeleteNumObservation] = useState<number | null>(null);

  const sortedObservations = [...observations].sort(
    (a, b) => a.num_observation - b.num_observation,
  );

  const handleOpenModal = useCallback(
    (modalType: "comments" | "historyComments" | "edit" | "rescheduleComments", num: number) => {
      dispatch(setCurrentObservationNumber(num));
      switch (modalType) {
        case "comments":
          dispatch(toggleModalComments(true));
          break;
        case "historyComments":
          dispatch(toggleModalHistoryComments(true));
          break;
        case "rescheduleComments":
          setRescheduleModalData({
            isOpen: true,
            objectId: num,
          });
          break;
        case "edit":
          const item = observations.find((item) => item.num_observation === num);
          if (item) {
            setEditItem(item);
            dispatch(toggleModalEdit(true));
          }
          break;
      }
    },
    [dispatch, observations],
  );

  const handleCloseModal = useCallback(
    (modalType: "comments" | "historyComments" | "rescheduleComments" | "edit") => {
      switch (modalType) {
        case "comments":
          dispatch(toggleModalComments(false));
          break;
        case "historyComments":
          dispatch(toggleModalHistoryComments(false));
          break;
        case "rescheduleComments":
          dispatch(toggleModalRescheduleComments(false));
          break;
        case "edit":
          dispatch(toggleModalEdit(false));
          break;
      }
    },
    [dispatch],
  );

  const handleCloseRescheduleModal = useCallback(() => {
    setRescheduleModalData({
      isOpen: false,
      objectId: null,
    });
  }, []);

  const handleDelete = (num_observation: number) => {
    setDeleteNumObservation(num_observation);
    setConfirmDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (deleteNumObservation === null || !onDelete) return;
    try {
      await onDelete(deleteNumObservation);
      setConfirmDeleteOpen(false);
      setDeleteNumObservation(null);
      addSnackbar(SnackbarType.success, `Наблюдение № ${deleteNumObservation} успешно удалено`);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Ошибка при удалении наблюдения";
      addSnackbar(SnackbarType.error, errorMessage);
    }
  };

  const cancelDelete = () => {
    setConfirmDeleteOpen(false);
    setDeleteNumObservation(null);
  };

  const openModal = (item?: ObservationResponseGET) => {
    setEditItem(item || null);
    dispatch(toggleModalEdit(true));
  };

  const handleRestore = async (num_observation: number) => {
    if (onRestore) {
      try {
        await onRestore(num_observation);
        addSnackbar(SnackbarType.success, `Наблюдение № ${num_observation} успешно восстановлено`);
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Ошибка при восстановлении наблюдения";
        addSnackbar(SnackbarType.error, errorMessage);
      }
    }
  };

  const handleArchive = useCallback(
    async (num_observation: number) => {
      try {
        await dispatch(
          updateObservationRequest({
            num_observation,
            data: {
              is_archived: true,
              observation_closure_date: new Date().toISOString(),
              resp_person_observation_closure: "Текущий пользователь",
            },
          }),
        ).unwrap();

        addSnackbar(
          SnackbarType.success,
          `Наблюдение № ${num_observation} успешно перенесено в архив`,
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Ошибка при архивации наблюдения";
        addSnackbar(SnackbarType.error, errorMessage);
      }
    },
    [dispatch, addSnackbar],
  );

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
          <button onClick={onFetch}>Получить данные</button>
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
              {sortedObservations.length === 0 ? (
                <tr>
                  <td colSpan={8} className="error">
                    Нет данных для отображения.
                  </td>
                </tr>
              ) : (
                sortedObservations.map((item) => (
                  <tr key={item.num_observation}>
                    <td>{item.num_observation}</td>
                    <td>
                      {item.normative_documents && item.normative_documents.length > 0
                        ? item.normative_documents.map((doc, index) => (
                            <p key={index}>
                              - {doc.norm_doc || "-"}, {doc.point || "-"}
                            </p>
                          ))
                        : "-"}
                    </td>
                    <td>{item.observation || "-"}</td>
                    <td>
                      {item.report || "-"} от {formatDate(item.report_date)}
                    </td>
                    <td>
                      {item.solutions?.map((sol, index) => (
                        <p key={index} className={styles.solText}>
                          {index + 1}. {sol.solution || "-"}
                        </p>
                      ))}
                    </td>
                    <td>
                      {item.solutions?.map((sol, index) => (
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
                      {item.solutions?.map((sol, index) => (
                        <div key={index} className={styles.solText}>
                          {index + 1}. {sol.solution_date && formatDate(sol.solution_date)}
                        </div>
                      ))}
                    </td>
                    <td>
                      <div className={styles.observationActions}>
                        {isArchived && item.observation_closure_date && (
                          <p>
                            Дата переноса в архив: <br />
                            <b>{formatDateTime(item.observation_closure_date)}</b>
                          </p>
                        )}

                        {showEditAction && (
                          <a
                            href="#"
                            className={styles.redText}
                            onClick={() => handleOpenModal("edit", item.num_observation)}
                          >
                            Изменить
                          </a>
                        )}

                        <a
                          href="#"
                          onClick={() => handleOpenModal("comments", item.num_observation)}
                        >
                          Комментарии
                        </a>
                        <a
                          href="#"
                          onClick={() =>
                            handleOpenModal("rescheduleComments", item.num_observation)
                          }
                        >
                          История переноса сроков выполнения
                        </a>

                        {!isArchived && showArchiveAction && (
                          <a
                            href="#"
                            title="Закрыть наблюдение и перенести в архив"
                            className={styles.greenText}
                            onClick={(e) => {
                              e.preventDefault();
                              handleArchive(item.num_observation);
                            }}
                          >
                            Закрыть и перенести в архив
                          </a>
                        )}
                        {showDeleteAction && (
                          <a
                            href="#"
                            title="Удалить наблюдение может только администратор"
                            className={styles.redText}
                            onClick={(e) => {
                              e.preventDefault();
                              handleDelete(item.num_observation);
                            }}
                          >
                            Удалить
                          </a>
                        )}

                        {onRestore && isArchived && (
                          <a
                            href="#"
                            title="Восстановить наблюдение может только главный аудитор и администратор"
                            className={styles.redText}
                            onClick={() => handleRestore(item.num_observation)}
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
              onClose={() => handleCloseModal("edit")}
              editItem={editItem}
            />
          </section>
        )}

        <CommentsAdderModal
          content_type="observation"
          object_id={currentObservationNumber}
          isOpen={isModalCommentsOpen}
          onClose={() => dispatch(toggleModalComments(false))}
          entityTitle="наблюдению"
        />

        <RescheduleCommentsAdderModal
          content_type="observation"
          object_id={rescheduleModalData.objectId}
          isOpen={rescheduleModalData.isOpen}
          onClose={handleCloseRescheduleModal}
          entityTitle="наблюдению"
        />

        <ConfirmDeleteModal
          open={confirmDeleteOpen}
          onClose={cancelDelete}
          onConfirm={confirmDelete}
          title="Подтверждение удаления"
          message={`Вы уверены, что хотите удалить наблюдение № ${deleteNumObservation}?`}
        />
      </main>
    </>
  );
};

export default React.memo(ObservationTable);
