"use client";

import { useEffect, useState } from "react";
import "@/globals.css";
import styles from "./styles.module.css";
import { InconsistenciesHistoryCommentsModal } from "@modals/historyCommentsList";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentInconsistencyNumber, toggleModalHistoryComments } from "../../../store/numSlice";
import { fetchItems, restoreInconsistencyRequest } from "@api/route";
import { SnackbarType } from "@components/types";
import { useSnackbar } from "@components/snackbar/snackbarContext";
import { AppDispatch, RootState } from "../../../store/store";
import { SearchInput } from "@components/searchInput";

const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const ArchiveInconsistencies = () => {
  const dispatch = useDispatch<AppDispatch>();
  const addSnackbar = useSnackbar();
  const {
    currentInconsistencyNumber,
    isModalHistoryCommentsOpen,
    archivedItems,
    itemsLoading,
    itemsError,
  } = useSelector((state: RootState) => state.num);

  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const loadItems = async () => {
      try {
        const result = await dispatch(fetchItems({ is_archived: true })).unwrap();
        console.log("Fetched archived items:", result);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Ошибка при загрузке данных";
        setFetchError(errorMessage);
        addSnackbar(SnackbarType.error, errorMessage);
      }
    };
    loadItems();
  }, [dispatch, addSnackbar]);

  const handleOpenModal = (num: number) => {
    dispatch(setCurrentInconsistencyNumber(num));
    dispatch(toggleModalHistoryComments(true));
  };

  const handleCloseModal = () => {
    dispatch(toggleModalHistoryComments(false));
  };

  const handleRestore = async (num_nonconf: number) => {
    try {
      await dispatch(restoreInconsistencyRequest(num_nonconf)).unwrap();
      addSnackbar(SnackbarType.success, `Несоответствие № ${num_nonconf} восстановлено`);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Ошибка при восстановлении несоответствия";
      addSnackbar(SnackbarType.error, errorMessage);
    }
  };

  const sortedItems = [...archivedItems].sort((a, b) => a.num_nonconf - b.num_nonconf);

  if (itemsLoading) {
    return <div>Загрузка архива несоответствий...</div>;
  }

  if (itemsError || fetchError) {
    return <div>Ошибка: {itemsError || fetchError}</div>;
  }

  return (
    <>
      <main className={styles.main}>
        <h3>
          Архив несоответствий по результатам внутренних аудитов СМК и внутренних технологических
          аудитов
        </h3>
        <section className={styles.filterSection}>
          <SearchInput />
          <button onClick={() => dispatch(fetchItems({ is_archived: true }))}>
            Получить данные
          </button>
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
                        <p>
                          Дата проведения оценки и переноса в архив: <br />
                          <b>{formatDate(item.nonconf_closure_date)}</b>
                        </p>
                        <p
                          className={
                            item.estimate === 1
                              ? styles.estimateSatisfactory
                              : styles.estimateUnsatisfactory
                          }
                        >
                          Оценка результативности:{" "}
                          <b>{item.estimate === 1 ? "удовлетворительно" : "неудовлетворительно"}</b>
                        </p>
                        <a href="#" onClick={() => handleOpenModal(item.num_nonconf)}>
                          Посмотреть историю комментариев к несоответствию
                        </a>
                        <a
                          href="#"
                          title="Восстановить несоответствие может только администратор"
                          className={styles.redText}
                          onClick={() => handleRestore(item.num_nonconf)}
                        >
                          Восстановить
                        </a>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
        <InconsistenciesHistoryCommentsModal
          currentInconsistencyNumber={currentInconsistencyNumber}
          isOpen={isModalHistoryCommentsOpen}
          onClose={handleCloseModal}
        />
      </main>
    </>
  );
};

export default ArchiveInconsistencies;
