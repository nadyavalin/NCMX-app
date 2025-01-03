"use client";

import { useState } from "react";
import "@/globals.css";
import styles from "./styles.module.css";
import { useFetchItems } from "@api/api";
import { InconsistenciesModal } from "@modals/InconsistenciesAdder";
import { InconsistenciesCommentsModal } from "@modals/commentsAdder";
import { InconsistenciesEstimateResultModal } from "@modals/estimateResult";
import { InconsistenciesHistoryCommentsModal } from "@modals/historyCommentsList";

export const Inconsistencies = () => {
  const { items, loading, error } = useFetchItems();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isModalCommentsOpen, setIsModalCommentsOpen] = useState<boolean>(false);
  const [isModalHistoryCommentsOpen, setIsModalHistoryCommentsOpen] = useState<boolean>(false);
  const [isModalEstimateResultOpen, setIsModalEstimateResultOpen] = useState<boolean>(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const openModalComments = () => setIsModalCommentsOpen(true);
  const closeModalComments = () => setIsModalCommentsOpen(false);

  const openModalHistoryComments = () => setIsModalHistoryCommentsOpen(true);
  const closeModalHistoryComments = () => setIsModalHistoryCommentsOpen(false);

  const openModalEstimateResult = () => setIsModalEstimateResultOpen(true);
  const closeModalEstimateResult = () => setIsModalEstimateResultOpen(false);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <main>
        <h3>
          Реестр несоответствий по результатам внутренних аудитов СМК и внутренних технологических
          аудитов
        </h3>
        <section className={styles.filterSection}>
          <select>
            <option value="orderNumber">фильтр по порядковому номеру</option>
            <option value="requirements">фильтр по требованиям НД</option>
            <option value="requirements">фильтр по подразделению</option>
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

          <button>Получить данные</button>
        </section>

        <section className="inconsistenciesTableSection">
          <table className="inconsistenciesTable">
            <thead>
              <tr>
                <th rowSpan={2}>ID</th>
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
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.num_nonconf}</td>
                    <td>{item.norm_doc}</td>
                    <td>{item.nonconf}</td>
                    <td>{item.report}</td>
                    <td>{item.analysis_start_date}</td>
                    <td>{item.head_auditor}</td>
                    <td>{item.reason}</td>
                    <td>{item.correction}</td>
                    <td>{item.correction_date}</td>
                    <td>{item.resp_person_correction}</td>
                    <td>{item.corrective_action}</td>
                    <td>{item.corrective_action_date}</td>
                    <td>{item.resp_person_corrective_action}</td>
                    <td>
                      <div className={styles.inconsistenciesActions}>
                        <a href="#" onClick={openModalComments}>
                          Добавить комментарий
                        </a>
                        <InconsistenciesCommentsModal
                          isOpen={isModalCommentsOpen}
                          onClose={closeModalComments}
                        />
                        <a href="#" onClick={openModalHistoryComments}>
                          Посмотреть историю комментариев к несоответствию
                        </a>
                        <InconsistenciesHistoryCommentsModal
                          isOpen={isModalHistoryCommentsOpen}
                          onClose={closeModalHistoryComments}
                        />
                        <a href="#" onClick={openModalEstimateResult}>
                          Провести оценку результативности для закрытия несоответствия
                        </a>
                        <InconsistenciesEstimateResultModal
                          isOpen={isModalEstimateResultOpen}
                          onClose={closeModalEstimateResult}
                        />
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
          <InconsistenciesModal isOpen={isModalOpen} onClose={closeModal} />
        </section>
      </main>
    </>
  );
};
