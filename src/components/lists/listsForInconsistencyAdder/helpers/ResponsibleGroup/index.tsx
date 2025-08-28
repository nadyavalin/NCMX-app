import React from "react";
import { ItemRequestPOST } from "@appTypes/types";
import { ResponsiblePairs } from "../../ResponsiblePairs";

interface ResponsibleGroupProps {
  formData: ItemRequestPOST;
  setFormData: React.Dispatch<React.SetStateAction<ItemRequestPOST>>;
  createLoading: boolean;
  fieldName: "responsible_for_correction" | "responsible_for_corrective_action";
  addText: string;
  correctionIndex: number;
}

export const ResponsibleGroup = ({
  formData,
  setFormData,
  createLoading,
  fieldName,
  addText,
  correctionIndex,
}: ResponsibleGroupProps) => {
  const items =
    fieldName === "responsible_for_correction"
      ? formData.corrections?.[correctionIndex]?.responsible_for_correction || [
          { department: "", person: "" },
        ]
      : formData.corrective_actions?.[correctionIndex]?.responsible_for_corrective_action || [
          { department: "", person: "" },
        ];

  return (
    <ResponsiblePairs
      items={items}
      setFormData={setFormData}
      createLoading={createLoading}
      fieldName={fieldName}
      addText={addText}
      correctionIndex={correctionIndex}
    />
  );
};

export default React.memo(ResponsibleGroup);
