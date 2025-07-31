"use client";

import { useEffect, useState } from "react";
import "@/globals.css";
import styles from "./styles.module.css";
import { InconsistenciesModal } from "@modals/InconsistenciesAdder";
import { InconsistenciesCommentsModal } from "@modals/commentsAdder";
import { InconsistenciesEstimateResultModal } from "@modals/estimateResult";
import { InconsistenciesHistoryCommentsModal } from "@modals/historyCommentsList";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentInconsistencyNumber,
  toggleModalComments,
  toggleModalEstimateResult,
  toggleModalHistoryComments,
  toggleModalEdit,
} from "../../store/numSlice";
import { RootState, AppDispatch } from "../../store/store";
import { deleteInconsistencyRequest, fetchItems } from "@api/route";
import { ItemResponseGET, SnackbarType } from "@components/types";
import { useSnackbar } from "@components/snackbar/snackbarContext";
import { ConfirmDeleteModal } from "@components/modals/confirmDelete";

export const Inconsistencies = () => {
  const dispatch = useDispatch<AppDispatch>();
  const addSnackbar = useSnackbar();
  const {
    currentInconsistencyNumber,
    isModalCommentsOpen,
    isModalHistoryCommentsOpen,
    isModalEstimateResultOpen,
    isModalEditOpen,
    items,
    itemsLoading,
    itemsError,
    createError,
  } = useSelector((state: RootState) => state.num);

  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState<boolean>(false);
  const [deleteNumNonconf, setDeleteNumNonconf] = useState<number | null>(null);
  const [editItem, setEditItem] = useState<ItemResponseGET | null>(null);

  useEffect(() => {
    const loadItems = async () => {
      try {
        await dispatch(fetchItems()).unwrap();
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Ошибка при загрузке данных";
        setFetchError(errorMessage);
        addSnackbar(SnackbarType.error, errorMessage);
      }
    };
    loadItems();
  }, [dispatch, addSnackbar]);

  const openModal = () => {
    setEditItem(null); // Режим создания
    dispatch(toggleModalEdit(true));
  };

  const openEditModal = (num_nonconf: number) => {
    const item = items.find((item) => item.num_nonconf === num_nonconf);
    if (item) {
      setEditItem(item);
      dispatch(toggleModalEdit(true));
    }
  };

  const handleOpenModal = (
    modalType: "comments" | "historyComments" | "estimateResult" | "edit",
    num: number | null = null,
  ) => {
    if (num !== null) {
      dispatch(setCurrentInconsistencyNumber(num));
    }
    switch (modalType) {
      case "comments":
        dispatch(toggleModalComments(true));
        break;
      case "historyComments":
        dispatch(toggleModalHistoryComments(true));
        break;
      case "estimateResult":
        dispatch(toggleModalEstimateResult(true));
        break;
      case "edit":
        openEditModal(num!);
        break;
    }
  };

  const handleCloseModal = (
    modalType: "comments" | "historyComments" | "estimateResult" | "edit",
  ) => {
    switch (modalType) {
      case "comments":
        dispatch(toggleModalComments(false));
        break;
      case "historyComments":
        dispatch(toggleModalHistoryComments(false));
        break;
      case "estimateResult":
        dispatch(toggleModalEstimateResult(false));
        break;
      case "edit":
        dispatch(toggleModalEdit(false));
        setEditItem(null);
        break;
    }
  };

  const handleDelete = (num_nonconf: number) => {
    setDeleteNumNonconf(num_nonconf);
    setConfirmDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (deleteNumNonconf === null) return;
    try {
      await dispatch(deleteInconsistencyRequest(deleteNumNonconf)).unwrap();
      setConfirmDeleteOpen(false);
      setDeleteNumNonconf(null);
      addSnackbar(SnackbarType.success, `Несоответствие №${deleteNumNonconf} успешно удалено`);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Ошибка при удалении несоответствия";
      setDeleteError(errorMessage);
      setConfirmDeleteOpen(false);
      setDeleteNumNonconf(null);
      addSnackbar(SnackbarType.error, errorMessage);
    }
  };

  const cancelDelete = () => {
    setConfirmDeleteOpen(false);
    setDeleteNumNonconf(null);
  };

  if (itemsLoading) {
    return <div>Загрузка таблицы несоответствий...</div>;
  }

  if (itemsError || fetchError || createError) {
    return <div>Ошибка: {itemsError || fetchError || createError}</div>;
  }

  return (
    <>
      <main>
        <h3>
          Реестр несоответствий по результатам внутренних аудитов СМК и внутренних технологических
          аудитов
        </h3>
        {deleteError && <div className={styles.errorMessage}>{deleteError}</div>}
        <section className={styles.filterSection}>
          <select>
            <option value="orderNumber">фильтр по порядковому номеру</option>
            <option value="requirements">фильтр по требованиям НД</option>
            <option value="departments">фильтр по подразделению</option>
            <option value="responsibleForCorrection">
              фильтр по ответственному лицу за коррекцию
            </option>
            <option value="responsibleForCorrectiveAction">
              фильтр по ответственному лицу за кор.действие
            </option>
          </select>
          <select>
            <option value="">порядковые номера из базы</option>
            <option value="">НД из базы</option>
            <option value="">аббревиатура подразделения из базы</option>
            <option value="">ФИО из базы</option>
            <option value="">ФИО из базы</option>
          </select>
          <input type="text" placeholder="Поиск..." />
          <button onClick={() => dispatch(fetchItems())}>Получить данные</button>
        </section>

        <section className="inconsistenciesTableSection">
          <table className="inconsistenciesTable">
            <thead>
              <tr>
                <th rowSpan={2}>№</th>
                <th rowSpan={2}>Ссылки на пункты ISO 9001 / 80079-34 / НД</th>
                <th rowSpan={2}>Описание несоответствия</th>
                <th rowSpan={2}>Источник информации о несоответствии</th>
                <th colSpan={3}>Анализ причин несоответствия</th>
                <th colSpan={3}>Коррекции</th>
                <th colSpan={3}>Корректирующие действия</th>
                <th rowSpan={2}>Действия с несоответствием</th>
              </tr>
              <tr>
                <th>Дата проведения анализа</th>
                <th>Состав группы, проводившей анализ</th>
                <th>Причины несоответствия, определенные по результатам анализа</th>
                <th>Описание коррекции</th>
                <th>Дата внедрения</th>
                <th>Ответственное лицо</th>
                <th>Описание корректирующего действия</th>
                <th>Дата внедрения</th>
                <th>Ответственное лицо</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={15} className="error">
                    Нет данных для отображения.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.num_nonconf}>
                    <td>{item.num_nonconf}</td>
                    <td>{item.norm_doc || "-"}</td>
                    <td>{item.nonconf || "-"}</td>
                    <td>{item.report || "-"}</td>
                    <td>{item.analysis_finish_date || "-"}</td>
                    <td>{item.head_auditor || "-"}</td>
                    <td>{item.reason || "-"}</td>
                    <td>{item.correction || "-"}</td>
                    <td>{item.correction_date || "-"}</td>
                    <td>{item.resp_person_correction || "-"}</td>
                    <td>{item.corrective_action || "-"}</td>
                    <td>{item.corrective_action_date || "-"}</td>
                    <td>{item.resp_person_corrective_action || "-"}</td>
                    <td>
                      <div className={styles.inconsistenciesActions}>
                        <a
                          href="#"
                          title="Изменить несоответствие может только администратор"
                          className={styles.redText}
                          onClick={() => handleOpenModal("edit", item.num_nonconf)}
                        >
                          Изменить несоответствие
                        </a>
                        <a href="#" onClick={() => handleOpenModal("comments", item.num_nonconf)}>
                          Добавить комментарий
                        </a>
                        <InconsistenciesCommentsModal
                          currentInconsistencyNumber={currentInconsistencyNumber}
                          isOpen={isModalCommentsOpen}
                          onClose={() => handleCloseModal("comments")}
                        />
                        <a
                          href="#"
                          onClick={() => handleOpenModal("historyComments", item.num_nonconf)}
                        >
                          Посмотреть историю комментариев к несоответствию
                        </a>
                        <InconsistenciesHistoryCommentsModal
                          currentInconsistencyNumber={currentInconsistencyNumber}
                          isOpen={isModalHistoryCommentsOpen}
                          onClose={() => handleCloseModal("historyComments")}
                        />
                        <a
                          href="#"
                          title="Провести оценку результативности может только главный аудитор"
                          className={styles.estimate}
                          onClick={() => handleOpenModal("estimateResult", item.num_nonconf)}
                        >
                          Провести оценку результативности для закрытия несоответствия и переноса в
                          архив
                        </a>
                        <InconsistenciesEstimateResultModal
                          isOpen={isModalEstimateResultOpen}
                          onClose={() => handleCloseModal("estimateResult")}
                        />
                        <a
                          href="#"
                          title="Удалить несоответствие может только администратор"
                          className={styles.redText}
                          onClick={() => handleDelete(item.num_nonconf)}
                        >
                          Удалить несоответствие
                        </a>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>

        <section className={styles.addButton}>
          <button onClick={openModal}>Добавить несоответствие</button>
          <InconsistenciesModal
            isOpen={isModalEditOpen}
            onClose={() => handleCloseModal("edit")}
            editItem={editItem}
          />
        </section>
        <ConfirmDeleteModal
          open={confirmDeleteOpen}
          onClose={cancelDelete}
          onConfirm={confirmDelete}
          title="Подтверждение удаления"
          message={`Вы уверены, что хотите удалить несоответствие №${deleteNumNonconf}?`}
        />
      </main>
    </>
  );
};

export default Inconsistencies;
