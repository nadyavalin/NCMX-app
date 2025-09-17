import styles from "./styles.module.css";
import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@store/store";
import {
  setCurrentInconsistencyNumber,
  toggleModalComments,
  toggleModalEstimateResult,
  toggleModalHistoryComments,
  toggleModalEdit,
} from "@store/uiSlice";
import { formatDate } from "@utils/formatDate";
import InconsistencyAdderModal from "@modals/InconsistencyAdderModal";
import CommentsAdderModal from "@modals/CommentsAdderModal";
import HistoryCommentsListModal from "@modals/HistoryCommentsListModal";
import EstimateModal from "@modals/EstimateModal";
import { ConfirmDeleteModal } from "@modals/ConfirmDeleteModal";
import { MainFilter } from "@components/lists/headFilters/MainFilter";
import { SearchInput } from "@components/SearchInput";
import { useSnackbar } from "@components/Snackbar/snackbarContext";
import { ItemResponseGET, SnackbarType } from "@appTypes/types";
import { formatDateTime } from "@utils/formatDateTime";

interface InconsistencyTableProps {
  title: string;
  items: ItemResponseGET[];
  isLoading: boolean;
  error: string | null;
  isArchived: boolean;
  onFetch: () => void;
  onDelete?: (num_nonconf: number) => Promise<void>;
  onRestore?: (num_nonconf: number) => Promise<void>;
  showAddButton?: boolean;
  showEditAction?: boolean;
  showDeleteAction?: boolean;
  showEstimateAction?: boolean;
}

export const InconsistencyTable = ({
  title,
  items,
  isLoading,
  error,
  isArchived,
  onFetch,
  onDelete,
  onRestore,
  showAddButton = false,
  showEditAction = false,
  showDeleteAction = false,
  showEstimateAction = false,
}: InconsistencyTableProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const addSnackbar = useSnackbar();
  const {
    currentInconsistencyNumber,
    isModalCommentsOpen,
    isModalHistoryCommentsOpen,
    isModalEstimateResultOpen,
    isModalEditOpen,
  } = useSelector((state: RootState) => state.ui);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState<boolean>(false);
  const [deleteNumNonconf, setDeleteNumNonconf] = useState<number | null>(null);
  const [editItem, setEditItem] = useState<ItemResponseGET | null>(null);

  const sortedItems = [...items].sort((a, b) => a.num_nonconf - b.num_nonconf);

  const handleOpenModal = useCallback(
    (modalType: "comments" | "historyComments" | "estimateResult" | "edit", num: number) => {
      dispatch(setCurrentInconsistencyNumber(num));
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
          const item = items.find((item) => item.num_nonconf === num);
          if (item) {
            setEditItem(item);
            dispatch(toggleModalEdit(true));
          }
          break;
      }
    },
    [dispatch, items],
  );

  const handleCloseModal = useCallback(
    (modalType: "comments" | "historyComments" | "estimateResult" | "edit") => {
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
    },
    [dispatch],
  );

  const handleDelete = (num_nonconf: number) => {
    setDeleteNumNonconf(num_nonconf);
    setConfirmDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (deleteNumNonconf === null || !onDelete) return;
    try {
      await onDelete(deleteNumNonconf);
      setConfirmDeleteOpen(false);
      setDeleteNumNonconf(null);
      addSnackbar(SnackbarType.success, `Несоответствие № ${deleteNumNonconf} успешно удалено`);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Ошибка при удалении несоответствия";
      addSnackbar(SnackbarType.error, errorMessage);
    }
  };

  const cancelDelete = () => {
    setConfirmDeleteOpen(false);
    setDeleteNumNonconf(null);
  };

  const openModal = () => {
    setEditItem(null);
    dispatch(toggleModalEdit(true));
  };

  if (isLoading) {
    return <div>{`Загрузка ${isArchived ? "архива" : "таблицы"} несоответствий...`}</div>;
  }

  if (error) {
    return <div>Ошибка: {error}</div>;
  }

  return (
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
            {sortedItems.length === 0 ? (
              <tr>
                <td colSpan={15} className="error">
                  Нет данных для отображения.
                </td>
              </tr>
            ) : (
              sortedItems.map((item) => (
                <tr key={item.num_nonconf}>
                  <td>{item.num_nonconf}</td>
                  <td>
                    {item.normative_documents && item.normative_documents.length > 0
                      ? item.normative_documents.map((doc, index) => (
                          <p key={index}>
                            - {doc.norm_doc || "-"}, {doc.point || "-"}
                          </p>
                        ))
                      : "-"}
                  </td>
                  <td>{item.nonconf || "-"}</td>
                  <td>
                    {item.report || "-"} от {formatDate(item.report_date)}
                  </td>
                  <td>
                    {formatDate(item.analysis_start_date) || "-"} -{" "}
                    {formatDate(item.analysis_finish_date) || "-"}
                  </td>
                  <td>
                    <p>{item.head_auditor || "-"}</p>
                    {item.auditors && item.auditors.length > 0
                      ? item.auditors.map((person, index) => (
                          <p key={index}> {person.auditor || "-"}</p>
                        ))
                      : "-"}
                  </td>
                  <td>{item.reason || "-"}</td>
                  <td>
                    {item.corrections && item.corrections.length > 0
                      ? item.corrections.map((corr, index) => (
                          <p key={index} className={styles.corrText}>
                            {index + 1}. {corr.correction || "-"}
                          </p>
                        ))
                      : "-"}
                  </td>
                  <td>
                    {item.corrections && item.corrections.length > 0
                      ? item.corrections.map((corr, index) => (
                          <p key={index} className={styles.corrText}>
                            {index + 1}. {formatDate(corr.correction_date) || "-"}
                          </p>
                        ))
                      : "-"}
                  </td>
                  <td>
                    {item.corrections && item.corrections.length > 0
                      ? item.corrections.map((corr, index) => (
                          <div key={index}>
                            <p>{index + 1}.</p>
                            {corr.responsible_for_correction &&
                            corr.responsible_for_correction.length > 0 ? (
                              corr.responsible_for_correction.map((resp, respIndex) => (
                                <p key={respIndex} className={styles.corrText}>
                                  {resp.department || "-"}: {resp.person || "-"}
                                </p>
                              ))
                            ) : (
                              <p className={styles.corrText}>-</p>
                            )}
                          </div>
                        ))
                      : "-"}
                  </td>
                  <td>
                    {item.corrective_actions && item.corrective_actions.length > 0
                      ? item.corrective_actions.map((act, index) => (
                          <p key={index} className={styles.corrText}>
                            {index + 1}. {act.corrective_action || "-"}
                          </p>
                        ))
                      : "-"}
                  </td>
                  <td>
                    {item.corrective_actions && item.corrective_actions.length > 0
                      ? item.corrective_actions.map((act, index) => (
                          <p key={index} className={styles.corrText}>
                            {index + 1}. {formatDate(act.corrective_action_date) || "-"}
                          </p>
                        ))
                      : "-"}
                  </td>
                  <td>
                    {item.corrective_actions && item.corrective_actions.length > 0
                      ? item.corrective_actions.map((act, index) => (
                          <div key={index}>
                            <p>{index + 1}.</p>
                            {act.responsible_for_corrective_action &&
                            act.responsible_for_corrective_action.length > 0 ? (
                              act.responsible_for_corrective_action.map((resp, respIndex) => (
                                <p key={respIndex} className={styles.corrText}>
                                  {resp.department || "-"}: {resp.person || "-"}
                                </p>
                              ))
                            ) : (
                              <p className={styles.corrText}>-</p>
                            )}
                          </div>
                        ))
                      : "-"}
                  </td>
                  <td>
                    <div className={styles.inconsistenciesActions}>
                      {isArchived && (
                        <>
                          <p>
                            Дата проведения оценки и переноса в архив: <br />
                            <b>{formatDateTime(item.nonconf_closure_date)}</b>
                          </p>
                          <p
                            className={
                              item.estimate === 1
                                ? styles.estimateSatisfactory
                                : styles.estimateUnsatisfactory
                            }
                          >
                            Оценка результативности:{" "}
                            <b>
                              {item.estimate === 1 ? "удовлетворительно" : "неудовлетворительно"}
                            </b>
                          </p>
                        </>
                      )}
                      {showEditAction && (
                        <a
                          href="#"
                          className={styles.redText}
                          onClick={() => handleOpenModal("edit", item.num_nonconf)}
                        >
                          Изменить несоответствие
                        </a>
                      )}
                      <a href="#" onClick={() => handleOpenModal("comments", item.num_nonconf)}>
                        Добавить комментарий
                      </a>
                      <a
                        href="#"
                        onClick={() => handleOpenModal("historyComments", item.num_nonconf)}
                      >
                        Посмотреть историю комментариев к несоответствию
                      </a>
                      {showEstimateAction && (
                        <a
                          href="#"
                          title="Провести оценку результативности может только главный аудитор"
                          className={styles.greenText}
                          onClick={() => handleOpenModal("estimateResult", item.num_nonconf)}
                        >
                          Провести оценку результативности для закрытия несоответствия и переноса в
                          архив
                        </a>
                      )}
                      {showDeleteAction && (
                        <a
                          href="#"
                          title="Удалить несоответствие может только администратор"
                          className={styles.redText}
                          onClick={() => handleDelete(item.num_nonconf)}
                        >
                          Удалить несоответствие
                        </a>
                      )}
                      {onRestore && (
                        <a
                          href="#"
                          title="Восстановить несоответствие может только главный аудитор и администратор"
                          className={styles.redText}
                          onClick={() => onRestore(item.num_nonconf)}
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

      {showAddButton && (
        <section className={styles.addButton}>
          <button onClick={openModal}>Добавить несоответствие</button>
          <InconsistencyAdderModal
            isOpen={isModalEditOpen}
            onClose={() => handleCloseModal("edit")}
            editItem={editItem}
          />
        </section>
      )}

      <CommentsAdderModal
        currentInconsistencyNumber={currentInconsistencyNumber}
        isOpen={isModalCommentsOpen}
        onClose={() => handleCloseModal("comments")}
      />
      <HistoryCommentsListModal
        currentInconsistencyNumber={currentInconsistencyNumber}
        isOpen={isModalHistoryCommentsOpen}
        onClose={() => handleCloseModal("historyComments")}
      />
      <EstimateModal
        isOpen={isModalEstimateResultOpen}
        onClose={() => handleCloseModal("estimateResult")}
      />
      <ConfirmDeleteModal
        open={confirmDeleteOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Подтверждение удаления"
        message={`Вы уверены, что хотите удалить несоответствие № ${deleteNumNonconf}?`}
      />
    </main>
  );
};

export default React.memo(InconsistencyTable);
