"use client";

import { useEffect, useState } from "react";
import "@/globals.css";
import styles from "./styles.module.css";
import { InconsistenciesHistoryCommentsModal } from "@modals/historyCommentsList";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentInconsistencyNumber, toggleModalHistoryComments } from "../../../store/numSlice";
import { fetchItems } from "@api/route";
import { SnackbarType } from "@components/types";
import { useSnackbar } from "@components/snackbar/snackbarContext";
import { AppDispatch, RootState } from "../../../store/store";

export const ArchiveInconsistencies = () => {
  const dispatch = useDispatch<AppDispatch>();
  const addSnackbar = useSnackbar();
  const {
    currentInconsistencyNumber,
    isModalHistoryCommentsOpen,
    items,
    itemsLoading,
    itemsError,
    createError,
  } = useSelector((state: RootState) => state.num);

  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const loadItems = async () => {
      try {
        await dispatch(fetchItems()).unwrap();
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Ошибка при загрузке данных";
        console.log("Inconsistencies: Fetch error", { errorMessage });
        setFetchError(errorMessage);
        addSnackbar(SnackbarType.error, errorMessage);
      }
    };
    loadItems();
  }, [dispatch, addSnackbar]);

  const handleOpenModal = (modalType: "historyComments", num: number | null = null) => {
    if (num !== null) {
      dispatch(setCurrentInconsistencyNumber(num));
    }
    switch (modalType) {
      case "historyComments":
        dispatch(toggleModalHistoryComments(true));
        break;
    }
  };

  const handleCloseModal = (modalType: "historyComments") => {
    switch (modalType) {
      case "historyComments":
        dispatch(toggleModalHistoryComments(false));
        break;
    }
  };

  const sortedItems = [...items].sort((a, b) => a.num_nonconf - b.num_nonconf);

  if (itemsLoading) {
    return <div>Загрузка таблицы несоответствий...</div>;
  }

  if (itemsError || fetchError || createError) {
    return <div>Ошибка: {itemsError || fetchError || createError}</div>;
  }

  return (
    <>
      <main className={styles.main}>
        <h3>
          Архив несоответствий по результатам внутренних аудитов СМК и внутренних технологических
          аудитов
        </h3>
        <section className={styles.filterSection}>
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
                          title="Восстановить несоответствие может только администратор"
                          className={styles.redText}
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
      </main>
    </>
  );
};

export default ArchiveInconsistencies;
