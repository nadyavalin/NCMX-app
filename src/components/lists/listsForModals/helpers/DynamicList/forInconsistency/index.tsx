import React, { JSX } from "react";
import {
  InconsistencyRequestPOST,
  Correction,
  CorrectiveAction,
  Responsible,
} from "@appTypes/types";
import styles from "./../styles.module.css";
type FieldName = keyof InconsistencyRequestPOST | keyof Correction | keyof CorrectiveAction;

interface DynamicListForInconsistencyProps<T extends object> {
  items: T[];
  setFormData: React.Dispatch<React.SetStateAction<InconsistencyRequestPOST>>;
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
  parentFieldName?: "corrections" | "corrective_actions";
  parentIndex?: number;
}

export const DynamicListForInconsistency = <T extends object>({
  items,
  setFormData,
  createLoading,
  fieldName,
  renderItem,
  addItemText,
  newItem,
  minItems = 1,
  listBlockClassName = styles.selectInputButtonBlock,
  parentFieldName,
  parentIndex,
}: DynamicListForInconsistencyProps<T>) => {
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    index: number,
    fieldName: FieldName,
  ) => {
    const { name, value } = event.target;
    setFormData((prevData) => {
      if (parentFieldName && parentIndex !== undefined) {
        const parentItems = Array.isArray(prevData[parentFieldName])
          ? [...(prevData[parentFieldName]! as (Correction | CorrectiveAction)[])]
          : [];
        const parentItem = parentItems[parentIndex] || {};
        const updatedItems = Array.isArray(parentItem[fieldName as keyof typeof parentItem])
          ? [...(parentItem[fieldName as keyof typeof parentItem] as Responsible[])]
          : [];
        updatedItems[index] = {
          ...updatedItems[index],
          [name]: name.includes("date") ? value || null : value,
        };
        parentItems[parentIndex] = {
          ...parentItem,
          [fieldName as keyof typeof parentItem]: updatedItems,
        };
        return { ...prevData, [parentFieldName]: parentItems };
      } else {
        const updatedItems = Array.isArray(prevData[fieldName as keyof InconsistencyRequestPOST])
          ? [...(prevData[fieldName as keyof InconsistencyRequestPOST]! as T[])]
          : [];
        updatedItems[index] = {
          ...updatedItems[index],
          [name]: name.includes("date") ? value || null : value,
        };
        return { ...prevData, [fieldName as keyof InconsistencyRequestPOST]: updatedItems };
      }
    });
  };

  const addItem = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setFormData((prevData) => {
      if (parentFieldName && parentIndex !== undefined) {
        const parentItems = Array.isArray(prevData[parentFieldName])
          ? [...(prevData[parentFieldName]! as (Correction | CorrectiveAction)[])]
          : [];
        const parentItem = parentItems[parentIndex] || {};
        const updatedItems = Array.isArray(parentItem[fieldName as keyof typeof parentItem])
          ? [...(parentItem[fieldName as keyof typeof parentItem] as Responsible[]), newItem]
          : [newItem];
        parentItems[parentIndex] = {
          ...parentItem,
          [fieldName as keyof typeof parentItem]: updatedItems,
        };
        return { ...prevData, [parentFieldName]: parentItems };
      } else {
        const updatedItems = Array.isArray(prevData[fieldName as keyof InconsistencyRequestPOST])
          ? [...(prevData[fieldName as keyof InconsistencyRequestPOST]! as T[]), newItem]
          : [newItem];
        return { ...prevData, [fieldName as keyof InconsistencyRequestPOST]: updatedItems };
      }
    });
  };

  const removeItem = (index: number) => {
    setFormData((prevData) => {
      if (parentFieldName && parentIndex !== undefined) {
        const parentItems = Array.isArray(prevData[parentFieldName])
          ? [...(prevData[parentFieldName]! as (Correction | CorrectiveAction)[])]
          : [];
        const parentItem = parentItems[parentIndex] || {};
        const updatedItems = Array.isArray(parentItem[fieldName as keyof typeof parentItem])
          ? (parentItem[fieldName as keyof typeof parentItem] as Responsible[]).filter(
              (_: unknown, i: number) => i !== index,
            )
          : [];
        parentItems[parentIndex] = {
          ...parentItem,
          [fieldName as keyof typeof parentItem]:
            updatedItems.length >= minItems ? updatedItems : [newItem],
        };
        return { ...prevData, [parentFieldName]: parentItems };
      } else {
        const updatedItems = Array.isArray(prevData[fieldName as keyof InconsistencyRequestPOST])
          ? (prevData[fieldName as keyof InconsistencyRequestPOST]! as T[]).filter(
              (_: unknown, i: number) => i !== index,
            )
          : [];
        return {
          ...prevData,
          [fieldName as keyof InconsistencyRequestPOST]:
            updatedItems.length >= minItems ? updatedItems : [newItem],
        };
      }
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

export default React.memo(DynamicListForInconsistency);
