import React from "react";
import styles from "./styles.module.css";
import { ItemRequestPOST, NormativeDocument } from "@appTypes/types";
import { DynamicList } from "../helpers/dynamicList";

interface NormativeDocumentsProps {
  normative_documents: NormativeDocument[];
  setFormData: React.Dispatch<React.SetStateAction<ItemRequestPOST>>;
  createLoading: boolean;
}

export const NormativeDocuments = ({
  normative_documents,
  setFormData,
  createLoading,
}: NormativeDocumentsProps) => {
  const renderItem = (
    item: NormativeDocument,
    index: number,
    handleChange: (
      event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
      index: number,
    ) => void,
    createLoading: boolean,
  ) => (
    <>
      <select
        name="norm_doc"
        id={`norm_doc_${index}`}
        value={item.norm_doc || ""}
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
        value={item.point || ""}
        placeholder="Номер(а) пункта(ов) ISO/НД"
        onChange={(e) => handleChange(e, index)}
        disabled={createLoading}
      />
    </>
  );

  return (
    <DynamicList<NormativeDocument>
      items={normative_documents}
      setFormData={setFormData}
      createLoading={createLoading}
      fieldName="normative_documents"
      renderItem={renderItem}
      addItemText="Добавить НД"
      newItem={{ norm_doc: "", point: "" }}
      minItems={1}
      listBlockClassName={styles.normativeDocumentBlock}
    />
  );
};

export default React.memo(NormativeDocuments);
