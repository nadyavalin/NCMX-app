import { FormEvent, useState } from "react";
import { ItemRequestPOST } from "@components/types";
import { sendInconsistencyRequest } from "@api/api";
import styles from "./styles.module.css";
import { ModalComponent } from "../modalComponent";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InconsistenciesModal = ({ isOpen, onClose }: ModalProps) => {
  const [formData, setFormData] = useState<ItemRequestPOST>({
    num_nonconf: 0,
    norm_doc: "",
    nonconf: "",
    report: "",
    analysis_start_date: "0000-00-00",
    head_auditor: "",
    reason: "",
    correction: "",
    correction_date: "0000-00-00",
    resp_person_correction: "",
    corrective_action: "",
    corrective_action_date: "0000-00-00",
    resp_person_corrective_action: "",
  });

  if (!isOpen) {
    return null;
  }

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    const updatedValue = name === "num_nonconf" ? parseInt(value, 10) : value;
    setFormData((prevData) => ({ ...prevData, [name]: updatedValue }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const result = await sendInconsistencyRequest(formData);
      console.log("Success: ", result);
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Error during API call: ", error);
    }
  };

  return (
    <ModalComponent isOpen={isOpen} onClose={onClose} additionalClass={styles.modalContentSpec}>
      <form className={styles.modalForm} onSubmit={handleSubmit}>
        <div className={styles.nonConfNumberBlock}>
          <h4>Заполните форму для внесения несоответствия в Реестр</h4>
          <div className={styles.nonConfNumberInputBlock}>
            <label htmlFor="num_nonconf">Номер несоответствия:</label>
            <input type="number" name="num_nonconf" id="num_nonconf" onChange={handleChange} />
          </div>
        </div>

        <div className={styles.modalInternalBlocks}>
          <p>1. Основная информация о несоответствии</p>
          <select name="norm_doc" id="norm_doc" onChange={handleChange}>
            <option value="">...выбрать нормативный документ из базы</option>
            <option value="А1">А1</option>
            <option value="А2">А2</option>
            <option value="А3">А3</option>
            <option value="А4">А4</option>
            <option value="А14">А14</option>
          </select>
          <a href="#">Добавить НД</a>
          <input
            name="point"
            type="text"
            placeholder="...номер пункта нормативного документа|"
            onChange={handleChange}
          />
          <textarea
            name="nonconf"
            id="nonconf"
            placeholder="Описание несоответствия|"
            rows={10}
            onChange={handleChange}
          />
          <input
            name="report"
            id="report"
            type="text"
            placeholder="Источник информации о несоответствии|"
            onChange={handleChange}
          />
          <input
            type="date"
            name="report_date"
            id="report_date"
            title="Выберите дату утверждения источника"
            onChange={handleChange}
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
            />
            <input
              type="date"
              name="analysis_finish_date"
              id="analysis_finish_date"
              title="Выберите дату окончания проведения анализа"
              onChange={handleChange}
            />
          </div>

          <select name="head_auditor" id="head_auditor" onChange={handleChange}>
            <option value="">...выбрать главного аудитора из базы</option>
            <option value="Разумнева Н.П.">Разумнева Н.П.</option>
          </select>

          <select name="auditor" id="auditor" onChange={handleChange}>
            <option value="">...выбрать аудитора из базы</option>
            <option value="Алтаева О.Ю.">Алтаева О.Ю.</option>
            <option value="Ткачук Н.С.">Ткачук Н.С.</option>
            <option value="Морозова Е.">Морозова Е.</option>
            <option value="Зюзева Е.">Зюзева Е.</option>
          </select>
          <a href="#">Добавить аудитора</a>
          <textarea
            name="reason"
            id="reason"
            placeholder="Причины несоответствия, определенные по результатам анализа|"
            rows={10}
            onChange={handleChange}
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
          />
          <div className={styles.oneLineText}>
            <input
              type="date"
              name="correction_date"
              id="correction_date"
              title="Выберите дату внедрения коррекции"
              onChange={handleChange}
            />
            <a href="#">Сменить на текстовое поле</a>
          </div>

          <select name="resp_person_correction" id="resp_person_correction" onChange={handleChange}>
            <option value="">...выбрать ответственное лицо из базы</option>
            <option value="Матвеева М.A.">Матвеева М.A.</option>
            <option value="Семенов К.С.">Семенов К.С.</option>
            <option value="Курженков С.А.">Курженков С.А.</option>
          </select>
          <a href="#">Добавить ответственное лицо</a>

          <select name="department" id="department" onChange={handleChange}>
            <option value="">...выбрать ответственное подразделение из базы</option>
            <option value="НПО">НПО</option>
            <option value="НПГС">НПГС</option>
            <option value="ПП СОК">ПП СОК</option>
            <option value="ПП ФЭИС">ПП ФЭИС</option>
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
          />
          <div className={styles.oneLineText}>
            <input
              type="date"
              name="corrective_action_date"
              id="corrective_action_date"
              title="Выберите дату внедрения корректирующего действия"
              onChange={handleChange}
            />
            <a href="#">Сменить на текстовое поле</a>
          </div>

          <select
            name="resp_person_corrective_action"
            id="resp_person_corrective_action"
            onChange={handleChange}
          >
            <option value="">...выбрать ответственное лицо из базы</option>
            <option value="Матвеева М.А.">Матвеева М.А.</option>
            <option value="Семенов К.С.">Семенов К.С.</option>
            <option value="Курженков С.А.">Курженков С.А.</option>
          </select>
          <a href="#">Добавить ответственное лицо</a>

          <select name="department" id="department" onChange={handleChange}>
            <option value="">...выбрать ответственное подразделение из базы</option>
            <option value="НПО">НПО</option>
            <option value="НПГС">НПГС</option>
            <option value="ПП СОК">ПП СОК</option>
            <option value="ПП ФЭИС">ПП ФЭИС</option>
          </select>
          <a href="#">Добавить ответственное подразделение</a>
        </div>
        <div className={styles.buttonsBlock}>
          <button type="submit">Сохранить и закрыть</button>
        </div>
      </form>
    </ModalComponent>
  );
};
