import React from "react";
import styles from "./styles.module.css";
import { ItemRequestPOST } from "../../../types/types";

interface NormativeDocumentsProps {
  normative_documents: { norm_doc: string; point: string }[];
  setFormData: React.Dispatch<React.SetStateAction<ItemRequestPOST>>;
  errors: { [key: string]: string };
  createLoading: boolean;
}

export const NormativeDocuments = ({
  normative_documents,
  setFormData,
  errors,
  createLoading,
}: NormativeDocumentsProps) => {
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    index: number,
  ) => {
    const { name, value } = event.target;
    setFormData((prevData) => {
      const updatedDocuments = [...prevData.normative_documents];
      updatedDocuments[index] = {
        ...updatedDocuments[index],
        [name]: value || "",
      };
      return { ...prevData, normative_documents: updatedDocuments };
    });
  };

  const addNormativeDocument = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setFormData((prevData) => ({
      ...prevData,
      normative_documents: [...prevData.normative_documents, { norm_doc: "", point: "" }],
    }));
  };

  const removeNormativeDocument = (index: number) => {
    setFormData((prevData) => {
      const updatedDocuments = prevData.normative_documents.filter((_, i) => i !== index);
      return {
        ...prevData,
        normative_documents:
          updatedDocuments.length > 0 ? updatedDocuments : [{ norm_doc: "", point: "" }],
      };
    });
  };

  return (
    <>
      {normative_documents.map((doc, index) => (
        <div key={index} className={styles.normativeDocumentBlock}>
          <select
            name="norm_doc"
            id={`norm_doc_${index}`}
            value={doc.norm_doc}
            onChange={(e) => handleChange(e, index)}
            disabled={createLoading}
            title="Нормативный документ"
          >
            <option value="">...выберите ISO/НД</option>
            <option value="ISO 9001">ISO 9001</option>
            <option value="ISO 80079-34">ISO 80079-34</option>
            <option value="A1">A1</option>
            <option value="A2">A2</option>
            <option value="A3">A3</option>
            <option value="A4">A4</option>
            <option value="A5.1">A5.1</option>
            <option value="A5.2">A5.2</option>
            <option value="A6.1">A6.1</option>
            <option value="A6.2">A6.2</option>
            <option value="A7">A7</option>
            <option value="A8.4">A8.4</option>
            <option value="A8.5">A8.5</option>
            <option value="A8.6">A8.6</option>
            <option value="A9">A9</option>
            <option value="A10">A10</option>
            <option value="A11">A11</option>
            <option value="A12">A12</option>
            <option value="A14">A14</option>
          </select>
          <input
            name="point"
            id={`point_${index}`}
            type="text"
            value={doc.point}
            placeholder="Номер(а) пункта(ов) ISO/НД"
            onChange={(e) => handleChange(e, index)}
            disabled={createLoading}
            className={styles.pointInput}
          />
          {normative_documents.length > 1 && (
            <button
              type="button"
              onClick={() => removeNormativeDocument(index)}
              disabled={createLoading}
              className={styles.removeButton}
            >
              Удалить
            </button>
          )}
        </div>
      ))}
      {errors.normative_documents && (
        <p className={styles.submitError}>{errors.normative_documents}</p>
      )}
      <a
        href="#"
        onClick={addNormativeDocument}
        className={createLoading ? styles.disabledLink : styles.activeLink}
      >
        Добавить НД
      </a>
    </>
  );
};

export default React.memo(NormativeDocuments);
