import React, { JSX } from "react";
import styles from "./styles.module.css";
import { ItemRequestPOST } from "../../../../../types/types";

interface DynamicListProps<T extends object> {
  items: T[];
  setFormData: React.Dispatch<React.SetStateAction<ItemRequestPOST>>;
  createLoading: boolean;
  fieldName: keyof ItemRequestPOST;
  renderItem: (
    item: T,
    index: number,
    handleChange: (
      event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
      index: number,
    ) => void,
    createLoading: boolean,
  ) => JSX.Element;
  addItemText: string;
  newItem: T;
  minItems?: number;
  listBlockClassName?: string;
}

export const DynamicList: <T extends object>(props: DynamicListProps<T>) => JSX.Element = <
  T extends object,
>({
  items,
  setFormData,
  createLoading,
  fieldName,
  renderItem,
  addItemText,
  newItem,
  minItems = 1,
  listBlockClassName = styles.listBlock,
}: DynamicListProps<T>) => {
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    index: number,
  ) => {
    const { name, value } = event.target;
    setFormData((prevData) => {
      const updatedItems = [...(prevData[fieldName] as T[])];
      updatedItems[index] = {
        ...updatedItems[index],
        [name]: value || "",
      };
      return { ...prevData, [fieldName]: updatedItems };
    });
  };

  const addItem = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: [...(prevData[fieldName] as T[]), newItem],
    }));
  };

  const removeItem = (index: number) => {
    setFormData((prevData) => {
      const updatedItems = (prevData[fieldName] as T[]).filter((_, i) => i !== index);
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
          {renderItem(item, index, handleChange, createLoading)}
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

export default React.memo(DynamicList);
