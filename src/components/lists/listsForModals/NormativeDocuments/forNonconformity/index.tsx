import React from "react";
import {
  Correction,
  CorrectiveAction,
  NonconformityRequestPOST,
  NormativeDocument,
} from "@appTypes/types";
import { DynamicListForNonconformity } from "../../helpers/DynamicList/forNonconformity";
import { NormativeDocumentsList } from "../NDList";

type FieldName = keyof NonconformityRequestPOST | keyof Correction | keyof CorrectiveAction;

interface NormativeDocumentsProps {
  normative_documents: NormativeDocument[];
  setFormData: React.Dispatch<React.SetStateAction<NonconformityRequestPOST>>;
  createLoading: boolean;
}

export const NormativeDocumentsForNonconformity = ({
  normative_documents,
  setFormData,
  createLoading,
}: NormativeDocumentsProps) => {
  const renderItem = (
    item: NormativeDocument,
    index: number,
    handleChange: (
      event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
      index: number,
      fieldName: FieldName,
    ) => void,
    createLoading: boolean,
    fieldName: FieldName,
  ) => (
    <>
      <select
        name="norm_doc"
        id={`norm_doc_${index}`}
        value={item.norm_doc || ""}
        onChange={(e) => handleChange(e, index, fieldName)}
        disabled={createLoading}
        title="Нормативный документ"
      >
        <NormativeDocumentsList />
      </select>
      <input
        name="point"
        id={`point_${index}`}
        type="text"
        value={item.point || ""}
        placeholder="Номер(а) пункта(ов) ISO/НД"
        onChange={(e) => handleChange(e, index, fieldName)}
        disabled={createLoading}
      />
    </>
  );

  return (
    <DynamicListForNonconformity<NormativeDocument>
      items={normative_documents}
      setFormData={setFormData}
      createLoading={createLoading}
      fieldName="normative_documents"
      renderItem={renderItem}
      addItemText="Добавить НД"
      newItem={{ norm_doc: "", point: "" }}
      minItems={1}
    />
  );
};

export default React.memo(NormativeDocumentsForNonconformity);
