import React from "react";
import styles from "./styles.module.css";
import { ItemRequestPOST, IAuditors } from "@appTypes/types";
import { DynamicList } from "../helpers/DynamicList";

interface AuditorProps {
  auditors: IAuditors[];
  setFormData: React.Dispatch<React.SetStateAction<ItemRequestPOST>>;
  createLoading: boolean;
}

export const Auditors = ({ auditors, setFormData, createLoading }: AuditorProps) => {
  const renderItem = (
    item: IAuditors,
    index: number,
    handleChange: (
      event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
      index: number,
    ) => void,
    createLoading: boolean,
  ) => (
    <select
      name="auditor"
      id={`auditor_${index}`}
      value={item.auditor || ""}
      onChange={(e) => handleChange(e, index)}
      disabled={createLoading}
      title="Аудитор"
    >
      <option value="">...выбрать аудитора</option>
      <option value="Алтаева О.Ю.">Алтаева О.Ю.</option>
      <option value="Ткачук Н.С.">Ткачук Н.С.</option>
      <option value="Морозова Е.А.">Морозова Е.А.</option>
      <option value="Зюзева Е.А.">Зюзева Е.А.</option>
    </select>
  );

  return (
    <DynamicList<IAuditors>
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
