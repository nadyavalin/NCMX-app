import React from "react";
import styles from "./styles.module.css";
import { ItemRequestPOST } from "../../../types/types";

interface AuditorProps {
  auditors: { auditor: string }[];
  setFormData: React.Dispatch<React.SetStateAction<ItemRequestPOST>>;
  errors: { [key: string]: string };
  createLoading: boolean;
}

export const Auditors = ({ auditors, setFormData, errors, createLoading }: AuditorProps) => {
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    index: number,
  ) => {
    const { name, value } = event.target;
    setFormData((prevData) => {
      const updateAuditors = [...prevData.auditors];
      updateAuditors[index] = {
        ...updateAuditors[index],
        [name]: value || "",
      };
      return { ...prevData, auditors: updateAuditors };
    });
  };

  const addAuditor = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setFormData((prevData) => ({
      ...prevData,
      auditors: [...prevData.auditors, { auditor: "" }],
    }));
  };

  const removeAuditor = (index: number) => {
    setFormData((prevData) => {
      const updateAuditors = prevData.auditors.filter((_, i) => i !== index);
      return {
        ...prevData,
        auditors: updateAuditors.length > 0 ? updateAuditors : [{ auditor: "" }],
      };
    });
  };

  return (
    <>
      {auditors.map((person, index) => (
        <div key={index} className={styles.auditorsBlock}>
          <select
            name="auditor"
            id={`auditor_${index}`}
            value={person.auditor}
            onChange={(e) => handleChange(e, index)}
            disabled={createLoading}
            title="Аудитор"
          >
            <option value="">...выбрать аудитора</option>
            <option value="Алтаева О.Ю.">Алтаева О.Ю.</option>
            <option value="Ткачук Н.С.">Ткачук Н.С.</option>
            <option value="Морозова Е.">Морозова Е.А.</option>
            <option value="Зюзева Е.">Зюзева Е.А.</option>
          </select>
          {auditors.length > 1 && (
            <button
              type="button"
              onClick={() => removeAuditor(index)}
              disabled={createLoading}
              className={styles.removeButton}
            >
              Удалить
            </button>
          )}
        </div>
      ))}
      {errors.auditors && <p className={styles.submitError}>{errors.auditors}</p>}
      <a href="#" onClick={addAuditor} className={createLoading ? styles.disabledLink : ""}>
        Добавить аудитора
      </a>
    </>
  );
};

export default React.memo(Auditors);
