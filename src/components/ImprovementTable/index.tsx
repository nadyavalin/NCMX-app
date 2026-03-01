"use client";

import "@/globals.css";
import styles from "./styles.module.css";
import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@store/store";
import {
  setCurrentImprovementNumber,
  toggleModalImprovementComments,
  toggleModalImprovementEdit,
} from "@store/uiSlice";
import { MainFilter } from "@components/lists/headFilters/MainFilter";
import { SearchInput } from "@components/SearchInput";
import { formatDateTime } from "@utils/formatDateTime";
import ImprovementAdderModal from "@modals/ImprovementAdderModal";
import { ImprovementResponseGET, SnackbarType, Responsible } from "@appTypes/types";
import { ConfirmDeleteModal } from "@modals/ConfirmDeleteModal";
import { useSnackbar } from "@components/Snackbar/snackbarContext";
import CommentsAdderModal from "@modals/CommentsAdderModal";
import { formatDate } from "@utils/formatDate";
import { updateImprovementRequest } from "@/api";

interface ImprovementTableProps {
  title: string;
  improvements: ImprovementResponseGET[];
  isLoading: boolean;
  error: string | null;
  isArchived: boolean;
  onFetch: () => void;
  onDelete?: (num_improvement: number) => Promise<void>;
  onRestore?: (num_improvement: number) => Promise<void>;
  showAddButton?: boolean;
  showEditAction?: boolean;
  showDeleteAction?: boolean;
  showArchiveAction?: boolean;
}

// Вспомогательная функция для форматирования списка ответственных
const formatResponsibleList = (responsibles: Responsible[]): string => {
  if (!responsibles || responsibles.length === 0) return "-";

  return responsibles
    .map((r) => r.person || "")
    .filter((name) => name.trim() !== "")
    .join(", ");
};

export const ImprovementTable = ({
  title,
  improvements: improvements,
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
}: ImprovementTableProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const addSnackbar = useSnackbar();
  const { currentImprovementNumber, isModalImprovementCommentsOpen, isModalImprovementEditOpen } =
    useSelector((state: RootState) => state.ui);
  const [editItem, setEditItem] = useState<ImprovementResponseGET | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState<boolean>(false);
  const [deleteNumImprovement, setDeleteNumImprovement] = useState<number | null>(null);

  const sortedImprovements = [...improvements].sort(
    (a, b) => a.num_improvement - b.num_improvement,
  );

  const handleOpenModal = useCallback(
    (modalType: "comments" | "edit", num: number) => {
      dispatch(setCurrentImprovementNumber(num));
      switch (modalType) {
        case "comments":
          dispatch(toggleModalImprovementComments(true));
          break;
        case "edit":
          const item = improvements.find((item) => item.num_improvement === num);
          if (item) {
            setEditItem(item);
            dispatch(toggleModalImprovementEdit(true));
          }
          break;
      }
    },
    [dispatch, improvements],
  );

  const handleCloseModal = useCallback(
    (modalType: "comments" | "edit") => {
      switch (modalType) {
        case "comments":
          dispatch(toggleModalImprovementComments(false));
          break;
        case "edit":
          dispatch(toggleModalImprovementEdit(false));
          break;
      }
    },
    [dispatch],
  );

  const handleDelete = (num_improvement: number) => {
    setDeleteNumImprovement(num_improvement);
    setConfirmDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (deleteNumImprovement === null || !onDelete) return;
    try {
      await onDelete(deleteNumImprovement);
      setConfirmDeleteOpen(false);
      setDeleteNumImprovement(null);
      addSnackbar(
        SnackbarType.success,
        `Возможность улучшения № ${deleteNumImprovement} успешно удалена`,
      );
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Ошибка при удалении возможности улучшения";
      addSnackbar(SnackbarType.error, errorMessage);
    }
  };

  const cancelDelete = () => {
    setConfirmDeleteOpen(false);
    setDeleteNumImprovement(null);
  };

  const openModal = (item?: ImprovementResponseGET) => {
    setEditItem(item || null);
    dispatch(toggleModalImprovementEdit(true));
  };

  const handleRestore = async (num_improvement: number) => {
    if (onRestore) {
      try {
        await onRestore(num_improvement);
        addSnackbar(
          SnackbarType.success,
          `Возможность улучшения № ${num_improvement} успешно восстановлена`,
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Ошибка при восстановлении возможности улучшения";
        addSnackbar(SnackbarType.error, errorMessage);
      }
    }
  };

  const handleArchive = useCallback(
    async (num_improvement: number) => {
      try {
        await dispatch(
          updateImprovementRequest({
            num_improvement,
            data: {
              is_archived: true,
              improvement_closure_date: new Date().toISOString(),
              resp_person_improvement_closure: "Текущий пользователь",
            },
          }),
        ).unwrap();

        addSnackbar(
          SnackbarType.success,
          `Возможность улучшения № ${num_improvement} успешно перенесена в архив`,
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Ошибка при архивации возможности улучшения";
        addSnackbar(SnackbarType.error, errorMessage);
      }
    },
    [dispatch, addSnackbar],
  );

  if (isLoading) {
    return <div>{`Загрузка ${isArchived ? "архива" : "таблицы"} возможностей улучшения...`}</div>;
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
                <th>Описание возможности для улучшения</th>
                <th>Источник информации о возможности для улучшения</th>
                <th>Ответственный за выполнение</th>
                <th>Срок выполнения</th>
                <th>Действия с возможностью для улучшения</th>
              </tr>
            </thead>
            <tbody>
              {sortedImprovements.length === 0 ? (
                <tr>
                  <td colSpan={6} className="error">
                    Нет данных для отображения.
                  </td>
                </tr>
              ) : (
                sortedImprovements.map((item) => (
                  <tr key={item.num_improvement}>
                    <td>{item.num_improvement}</td>
                    <td>{item.improvement || "-"}</td>
                    <td>
                      {item.report || "-"}{" "}
                      {item.report_date ? `от ${formatDate(item.report_date)}` : ""}
                    </td>
                    <td>
                      {formatResponsibleList(item.resp_persons_for_improvement_implementation)}
                    </td>
                    <td>
                      {item.date_implementation_for_improvement
                        ? formatDate(item.date_implementation_for_improvement)
                        : "-"}
                    </td>
                    <td>
                      <div className={styles.improvementActions}>
                        {isArchived && item.improvement_closure_date && (
                          <p>
                            Дата переноса в архив: <br />
                            <b>{formatDateTime(item.improvement_closure_date)}</b>
                          </p>
                        )}

                        {showEditAction && (
                          <a
                            href="#"
                            className={styles.redText}
                            onClick={() => handleOpenModal("edit", item.num_improvement)}
                          >
                            Изменить
                          </a>
                        )}

                        <a
                          href="#"
                          onClick={() => handleOpenModal("comments", item.num_improvement)}
                        >
                          Комментарии
                        </a>

                        {!isArchived && showArchiveAction && (
                          <a
                            href="#"
                            title="Закрыть возможность улучшения и перенести в архив"
                            className={styles.greenText}
                            onClick={(e) => {
                              e.preventDefault();
                              handleArchive(item.num_improvement);
                            }}
                          >
                            Закрыть и перенести в архив
                          </a>
                        )}
                        {showDeleteAction && (
                          <a
                            href="#"
                            title="Удалить возможность улучшения может только администратор"
                            className={styles.redText}
                            onClick={(e) => {
                              e.preventDefault();
                              handleDelete(item.num_improvement);
                            }}
                          >
                            Удалить
                          </a>
                        )}

                        {onRestore && isArchived && (
                          <a
                            href="#"
                            title="Восстановить возможность улучшения может только главный аудитор и администратор"
                            className={styles.redText}
                            onClick={() => handleRestore(item.num_improvement)}
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
            <button onClick={() => openModal()}>Добавить возможность для улучшения</button>
            <ImprovementAdderModal
              isOpen={isModalImprovementEditOpen}
              onClose={() => handleCloseModal("edit")}
              editItem={editItem}
            />
          </section>
        )}

        <CommentsAdderModal
          content_type="improvement"
          object_id={currentImprovementNumber}
          isOpen={isModalImprovementCommentsOpen}
          onClose={() => dispatch(toggleModalImprovementComments(false))}
          entityTitle="возможности улучшения"
        />

        <ConfirmDeleteModal
          open={confirmDeleteOpen}
          onClose={cancelDelete}
          onConfirm={confirmDelete}
          title="Подтверждение удаления"
          message={`Вы уверены, что хотите удалить возможность улучшения № ${deleteNumImprovement}?`}
        />
      </main>
    </>
  );
};

export default React.memo(ImprovementTable);
