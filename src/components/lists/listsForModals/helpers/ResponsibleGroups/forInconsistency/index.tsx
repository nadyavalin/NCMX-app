import React from "react";
import { InconsistencyRequestPOST } from "@appTypes/types";
import { ResponsiblePairsForInconsistency } from "../../../ResponsiblePairs/forInconsistency";

interface ResponsibleGroupForInconsistencyProps {
  formData: InconsistencyRequestPOST;
  setFormData: React.Dispatch<React.SetStateAction<InconsistencyRequestPOST>>;
  createLoading: boolean;
  fieldName: "corrections" | "corrective_actions";
  addText: string;
  correctionIndex: number;
}

export const ResponsibleGroupForInconsistency = ({
  formData,
  setFormData,
  createLoading,
  fieldName,
  addText,
  correctionIndex,
}: ResponsibleGroupForInconsistencyProps) => {
  const items =
    fieldName === "corrections"
      ? formData.corrections?.[correctionIndex]?.responsible_for_correction || [
          { department: "", person: "" },
        ]
      : formData.corrective_actions?.[correctionIndex]?.responsible_for_corrective_action || [
          { department: "", person: "" },
        ];

  return (
    <ResponsiblePairsForInconsistency
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

export default React.memo(ResponsibleGroupForInconsistency);
