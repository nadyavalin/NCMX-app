import React from "react";
import { NonconformityRequestPOST } from "@appTypes/types";
import { ResponsiblePairsForNonconformity } from "../../../ResponsiblePairs/forNonconformity";

interface ResponsibleGroupForNonconformityProps {
  formData: NonconformityRequestPOST;
  setFormData: React.Dispatch<React.SetStateAction<NonconformityRequestPOST>>;
  createLoading: boolean;
  fieldName: "corrections" | "corrective_actions";
  addText: string;
  correctionIndex: number;
}

export const ResponsibleGroupForNonconformity = ({
  formData,
  setFormData,
  createLoading,
  fieldName,
  addText,
  correctionIndex,
}: ResponsibleGroupForNonconformityProps) => {
  const items =
    fieldName === "corrections"
      ? formData.corrections?.[correctionIndex]?.responsible_for_correction || [
          { department: "", person: "" },
        ]
      : formData.corrective_actions?.[correctionIndex]?.responsible_for_corrective_action || [
          { department: "", person: "" },
        ];

  return (
    <ResponsiblePairsForNonconformity
      items={items}
      setFormData={setFormData}
      createLoading={createLoading}
      fieldName={
        fieldName === "corrections"
          ? "responsible_for_correction"
          : "responsible_for_corrective_action"
      }
      addText={addText}
      correctionIndex={correctionIndex}
    />
  );
};

export default React.memo(ResponsibleGroupForNonconformity);
