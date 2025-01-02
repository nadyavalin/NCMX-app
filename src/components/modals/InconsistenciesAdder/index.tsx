import { FormEvent, useState } from "react";
import "@/globals.css";
import styles from "./styles.module.css";
import { CloseButton } from "@components/svg";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InconsistenciesModal = ({ isOpen, onClose }: ModalProps) => {
  const [inputData, setInputData] = useState("");

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch("http://178.66.48.32:8000/api/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: inputData }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const result = await response.json();
      console.log("Response data:", result);
    } catch (error) {
      console.error("Ошибка при отправке данных:", error);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.closeButton} onClick={onClose} role="button" tabIndex={0}>
          <CloseButton />
        </div>
        <form className={styles.modalForm} method="post" onSubmit={handleSubmit}>
          <div className={styles.nonConfNumberBlock}>
            <h4>Заполните форму для внесения несоответствия в Реестр</h4>
            <div className={styles.nonConfNumberInputBlock}>
              <label htmlFor="num_nonconf">Номер несоответствия:</label>
              <input
                type="text"
                name="num_nonconf"
                id="num_nonconf"
                value={inputData}
                onChange={(e) => setInputData(e.target.value)}
                required
              />
            </div>
          </div>

          <div className={styles.modalInternalBlocks}>
            <p>1. Основная информация о несоответствии</p>
            <select name="norm_doc" id="norm_doc">
              <option value="">...выбрать нормативный документ из базы</option>
              <option value="">А1</option>
              <option value="">А2 </option>
              <option value="">А3</option>
              <option value="">А4</option>
              <option value="">...</option>
              <option value="">А14</option>
            </select>
            <a href="#">Добавить НД</a>
            <input
              name="point"
              type="text"
              placeholder="...номер пункта нормативного документа|"
              required
            />
            <textarea
              name="nonconf"
              id="nonconf"
              placeholder="Описание несоответствия|"
              rows={10}
              required
            />
            <input
              name="report"
              id="report"
              type="text"
              placeholder="Источник информации о несоответствии|"
              required
            />
            <input
              type="date"
              name="report_date"
              id="report_date"
              title="Выберите дату утверждения источника"
              required
            />
          </div>

          <div className={styles.modalInternalBlocks}>
            <p>2. Анализ причин несоответствия</p>
            <div className={styles.oneLineText}>
              <input
                type="date"
                name="analysis_start_date"
                id="analysis_start_date"
                title="Выберите дату начала проведения анализа"
              />
              <input
                type="date"
                name="analysis_finish_date"
                id="analysis_finish_date"
                title="Выберите дату окончания проведения анализа"
              />
            </div>

            <select name="head_auditor" id="head_auditor">
              <option value="">...выбрать главного аудитора из базы</option>
              <option value="">Разумнева Н.П.</option>
            </select>

            <select name="auditor" id="auditor">
              <option value="">...выбрать аудитора из базы</option>
              <option value="">Алтаева О.Ю.</option>
              <option value="">Ткачук Н.С.</option>
              <option value="">Морозова Е.</option>
              <option value="">Зюзева Е.</option>
            </select>
            <a href="#">Добавить аудитора</a>
            <textarea
              name="reason"
              id="reason"
              placeholder="Причины несоответствия, определенные по результатам анализа|"
              rows={10}
            />
          </div>

          <div className={styles.modalInternalBlocks}>
            <div className={styles.oneLineText}>
              <p>3. Коррекция</p>
              <a href="#">Добавить коррекцию</a>
            </div>
            <textarea
              name="correction"
              id="correction"
              placeholder="Описание коррекции|"
              rows={10}
            />
            <div className={styles.oneLineText}>
              <input
                type="date"
                name="correction_date"
                id="correction_date"
                title="Выберите дату внедрения коррекции"
              />
              <a href="#">Сменить на текстовое поле</a>
            </div>

            <select name="resp_person_correction" id="resp_person_correction">
              <option value="">...выбрать ответственное лицо из базы</option>
              <option value="">Матвеева М.А.</option>
              <option value="">Семенов К.С.</option>
              <option value="">...</option>
              <option value="">Курженков С.А.</option>
            </select>
            <a href="#">Добавить ответственное лицо</a>

            <select name="department" id="department" required>
              <option value="">...выбрать ответственное подразделение из базы</option>
              <option value="">НПО</option>
              <option value="">НПГС</option>
              <option value="">...</option>
              <option value="">ПП ФЭИС</option>
            </select>
            <a href="#">Добавить ответственное подразделение</a>
          </div>

          <div className={styles.modalInternalBlocks}>
            <div className={styles.oneLineText}>
              <p>4. Корректирующее действие</p>
              <a href="#">Добавить кор. действие</a>
            </div>
            <textarea
              name="corrective_action"
              id="corrective_action"
              placeholder="Описание корректирующего действия||"
              rows={10}
            />
            <div className={styles.oneLineText}>
              <input
                type="date"
                name="corrective_action_date"
                id="corrective_action_date"
                title="Выберите дату внедрения корректирующего действия"
              />
              <a href="#">Сменить на текстовое поле</a>
            </div>

            <select name="resp_person_corrective_action" id="resp_person_corrective_action">
              <option value="">...выбрать ответственное лицо из базы</option>
              <option value="">Матвеева М.А.</option>
              <option value="">Семенов К.С.</option>
              <option value="">...</option>
              <option value="">Курженков С.А.</option>
            </select>
            <a href="#">Добавить ответственное лицо</a>

            <select name="department" id="department" required>
              <option value="">...выбрать ответственное подразделение из базы</option>
              <option value="">НПО</option>
              <option value="">НПГС</option>
              <option value="">...</option>
              <option value="">ПП ФЭИС</option>
            </select>
            <a href="#">Добавить ответственное подразделение</a>
          </div>
          <div className={styles.buttonsBlock}>
            <button type="submit" onClick={onClose}>
              Сохранить и закрыть
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
