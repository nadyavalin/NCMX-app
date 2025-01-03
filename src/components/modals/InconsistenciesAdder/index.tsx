import { FormEvent, useState } from "react";
import "@/globals.css";
import styles from "./styles.module.css";
import { CloseButton } from "@components/svg";
import { Item } from "@components/types";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InconsistenciesModal = ({ isOpen, onClose }: ModalProps) => {
  const [formData, setFormData] = useState<Item>({
    id: 1,
    num_nonconf: "",
    norm_doc: "",
    nonconf: "",
    report: "",
    analysis_start_date: "",
    head_auditor: "",
    reason: "",
    correction: "",
    correction_date: "",
    resp_person_correction: "",
    corrective_action: "",
    corrective_action_date: "",
    resp_person_corrective_action: "",
  });

  if (!isOpen) {
    return null;
  }

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await fetch("http://178.66.48.32:8000/ncmx_app/api/ncmx/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      console.log(result);
      onClose();
    } catch (error) {
      console.error("Error submitting form: ", error);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.closeButton} onClick={onClose} role="button" tabIndex={0}>
          <CloseButton />
        </div>
        <form className={styles.modalForm} onSubmit={handleSubmit}>
          <div className={styles.nonConfNumberBlock}>
            <h4>Заполните форму для внесения несоответствия в Реестр</h4>
            <div className={styles.nonConfNumberInputBlock}>
              <label htmlFor="num_nonconf">Номер несоответствия:</label>
              <input
                type="text"
                name="num_nonconf"
                id="num_nonconf"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className={styles.modalInternalBlocks}>
            <p>1. Основная информация о несоответствии</p>
            <select name="norm_doc" id="norm_doc" onChange={handleChange} required>
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
              onChange={handleChange}
              required
            />
            <textarea
              name="nonconf"
              id="nonconf"
              placeholder="Описание несоответствия|"
              rows={10}
              onChange={handleChange}
              required
            />
            <input
              name="report"
              id="report"
              type="text"
              placeholder="Источник информации о несоответствии|"
              onChange={handleChange}
              required
            />
            <input
              type="date"
              name="report_date"
              id="report_date"
              title="Выберите дату утверждения источника"
              onChange={handleChange}
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
                onChange={handleChange}
                required
              />
              <input
                type="date"
                name="analysis_finish_date"
                id="analysis_finish_date"
                title="Выберите дату окончания проведения анализа"
                onChange={handleChange}
                required
              />
            </div>

            <select name="head_auditor" id="head_auditor" onChange={handleChange} required>
              <option value="">...выбрать главного аудитора из базы</option>
              <option value="">Разумнева Н.П.</option>
            </select>

            <select name="auditor" id="auditor" onChange={handleChange} required>
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
              onChange={handleChange}
              required
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
              onChange={handleChange}
              required
            />
            <div className={styles.oneLineText}>
              <input
                type="date"
                name="correction_date"
                id="correction_date"
                title="Выберите дату внедрения коррекции"
                onChange={handleChange}
                required
              />
              <a href="#">Сменить на текстовое поле</a>
            </div>

            <select
              name="resp_person_correction"
              id="resp_person_correction"
              onChange={handleChange}
              required
            >
              <option value="">...выбрать ответственное лицо из базы</option>
              <option value="">Матвеева М.A.</option>
              <option value="">Семенов К.С.</option>
              <option value="">...</option>
              <option value="">Курженков С.А.</option>
            </select>
            <a href="#">Добавить ответственное лицо</a>

            <select name="department" id="department" onChange={handleChange} required>
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
              onChange={handleChange}
              required
            />
            <div className={styles.oneLineText}>
              <input
                type="date"
                name="corrective_action_date"
                id="corrective_action_date"
                title="Выберите дату внедрения корректирующего действия"
                onChange={handleChange}
                required
              />
              <a href="#">Сменить на текстовое поле</a>
            </div>

            <select
              name="resp_person_corrective_action"
              id="resp_person_corrective_action"
              onChange={handleChange}
              required
            >
              <option value="">...выбрать ответственное лицо из базы</option>
              <option value="">Матвеева М.А.</option>
              <option value="">Семенов К.С.</option>
              <option value="">...</option>
              <option value="">Курженков С.А.</option>
            </select>
            <a href="#">Добавить ответственное лицо</a>

            <select name="department" id="department" onChange={handleChange} required>
              <option value="">...выбрать ответственное подразделение из базы</option>
              <option value="">НПО</option>
              <option value="">НПГС</option>
              <option value="">...</option>
              <option value="">ПП ФЭИС</option>
            </select>
            <a href="#">Добавить ответственное подразделение</a>
          </div>
          <div className={styles.buttonsBlock}>
            <button type="submit">Сохранить и закрыть</button>
          </div>
        </form>
      </div>
    </div>
  );
};
