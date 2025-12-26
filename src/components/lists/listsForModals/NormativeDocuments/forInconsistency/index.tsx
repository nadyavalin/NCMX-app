import React from "react";
import {
  Correction,
  CorrectiveAction,
  InconsistencyRequestPOST,
  NormativeDocument,
} from "@appTypes/types";
import { DynamicListForInconsistency } from "../../helpers/DynamicList/forInconsistency";
import { NormativeDocumentsList } from "../NDList";

type FieldName = keyof InconsistencyRequestPOST | keyof Correction | keyof CorrectiveAction;

interface NormativeDocumentsProps {
  normative_documents: NormativeDocument[];
  setFormData: React.Dispatch<React.SetStateAction<InconsistencyRequestPOST>>;
  createLoading: boolean;
}

export const NormativeDocumentsForInconsistency = ({
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
    <DynamicListForInconsistency<NormativeDocument>
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

export default React.memo(NormativeDocumentsForInconsistency);
