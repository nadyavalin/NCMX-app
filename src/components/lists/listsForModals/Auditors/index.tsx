import React from "react";
import styles from "./styles.module.css";
import { NonconformityRequestPOST, IAuditors, Correction, CorrectiveAction } from "@appTypes/types";
import { useSnackbar } from "@components/Snackbar/snackbarContext";
import { SnackbarType } from "@appTypes/types";
import { DynamicListForNonconformity } from "../helpers/DynamicList/forNonconformity";

type FieldName = keyof NonconformityRequestPOST | keyof Correction | keyof CorrectiveAction;

interface AuditorProps {
  auditors: IAuditors[];
  setFormData: React.Dispatch<React.SetStateAction<NonconformityRequestPOST>>;
  createLoading: boolean;
}

export const Auditors = ({ auditors, setFormData, createLoading }: AuditorProps) => {
  const addSnackbar = useSnackbar();

  const renderItem = (
    item: IAuditors,
    index: number,
    handleChange: (
      event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
      index: number,
      fieldName: FieldName,
    ) => void,
    createLoading: boolean,
    fieldName: FieldName,
  ) => {
    return (
      <div className={styles.auditorSelect}>
        <select
          name="auditor"
          id={`auditor_${index}`}
          value={item.auditor || ""}
          onChange={(e) => {
            const selectedAuditor = e.target.value;
            const isDuplicate = auditors.some(
              (auditor, i) =>
                i !== index && auditor.auditor === selectedAuditor && selectedAuditor !== "",
            );
            if (isDuplicate) {
              addSnackbar(
                SnackbarType.error,
                `Аудитор ${selectedAuditor} уже присутствует в группе аудиторов`,
              );
              return;
            }
            handleChange(e, index, fieldName);
          }}
          disabled={createLoading}
          title="Аудитор"
        >
          <option value="">...выбрать аудитора</option>
          <option value="Алтаева О.Ю.">Алтаева О.Ю.</option>
          <option value="Ткачук Н.С.">Ткачук Н.С.</option>
          <option value="Морозова Е.А.">Морозова Е.А.</option>
          <option value="Зюзева Е.А.">Зюзева Е.А.</option>
        </select>
      </div>
    );
  };

  return (
    <DynamicListForNonconformity<IAuditors>
      items={auditors}
      setFormData={setFormData}
      createLoading={createLoading}
      fieldName="auditors"
      renderItem={renderItem}
      addItemText="Добавить аудитора"
      newItem={{ auditor: "" }}
      minItems={1}
      listBlockClassName={styles.auditorsBlock}
    />
  );
};

export default React.memo(Auditors);
