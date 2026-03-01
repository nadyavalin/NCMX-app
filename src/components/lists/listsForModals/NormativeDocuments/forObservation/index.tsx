import React from "react";
import { Solution, ObservationRequestPOST, NormativeDocument } from "@appTypes/types";
import { DynamicListForObservation } from "../../helpers/DynamicList/forObservation";
import { NormativeDocumentsList } from "../NDList";

type FieldName = keyof ObservationRequestPOST | keyof Solution;

interface NormativeDocumentsProps {
  normative_documents: NormativeDocument[];
  setFormData: React.Dispatch<React.SetStateAction<ObservationRequestPOST>>;
  createLoading: boolean;
}

export const NormativeDocumentsForObservation = ({
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
    <DynamicListForObservation<NormativeDocument>
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

export default React.memo(NormativeDocumentsForObservation);
