import React, { JSX } from "react";
import { ImprovementRequestPOST } from "@appTypes/types";
import styles from "./../styles.module.css";

type FieldName = keyof ImprovementRequestPOST;

interface DynamicListForImprovementProps<T extends object> {
  items: T[];
  setFormData: React.Dispatch<React.SetStateAction<ImprovementRequestPOST>>;
  createLoading: boolean;
  fieldName: FieldName;
  renderItem: (
    item: T,
    index: number,
    handleChange: (
      event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
      index: number,
      fieldName: FieldName,
    ) => void,
    createLoading: boolean,
    fieldName: FieldName,
  ) => JSX.Element;
  addItemText: string;
  newItem: T;
  minItems?: number;
  listBlockClassName?: string;
}

export const DynamicListForImprovement = <T extends object>({
  items,
  setFormData,
  createLoading,
  fieldName,
  renderItem,
  addItemText,
  newItem,
  minItems = 1,
  listBlockClassName = styles.selectInputButtonBlock,
}: DynamicListForImprovementProps<T>) => {
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    index: number,
    fieldName: FieldName,
  ) => {
    const { name, value } = event.target;
    setFormData((prevData) => {
      const updatedItems = Array.isArray(prevData[fieldName])
        ? [...(prevData[fieldName]! as T[])]
        : [];
      updatedItems[index] = {
        ...updatedItems[index],
        [name]: name.includes("date") ? value || null : value,
      };
      return { ...prevData, [fieldName]: updatedItems };
    });
  };

  const addItem = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setFormData((prevData) => {
      const updatedItems = Array.isArray(prevData[fieldName])
        ? [...(prevData[fieldName]! as T[]), newItem]
        : [newItem];
      return { ...prevData, [fieldName]: updatedItems };
    });
  };

  const removeItem = (index: number) => {
    setFormData((prevData) => {
      const updatedItems = Array.isArray(prevData[fieldName])
        ? (prevData[fieldName]! as T[]).filter((_: unknown, i: number) => i !== index)
        : [];
      return {
        ...prevData,
        [fieldName]: updatedItems.length >= minItems ? updatedItems : [newItem],
      };
    });
  };

  return (
    <>
      {items.map((item, index) => (
        <div key={index} className={listBlockClassName}>
          <div className={styles.selectInputBlock}>
            {renderItem(item, index, handleChange, createLoading, fieldName)}
          </div>
          {items.length > minItems && (
            <button
              type="button"
              onClick={() => removeItem(index)}
              disabled={createLoading}
              className={styles.removeButton}
            >
              Удалить
            </button>
          )}
        </div>
      ))}
      <a
        href="#"
        onClick={addItem}
        className={createLoading ? styles.disabledLink : styles.activeLink}
      >
        {addItemText}
      </a>
    </>
  );
};

export default React.memo(DynamicListForImprovement);
