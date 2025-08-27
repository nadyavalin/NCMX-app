import React from "react";
import { ItemRequestPOST } from "../../../types/types";
import ResponsiblePairs from "../responsiblePairs";

interface ResponsibleGroupProps {
  formData: ItemRequestPOST;
  setFormData: React.Dispatch<React.SetStateAction<ItemRequestPOST>>;
  createLoading: boolean;
  fieldName: "responsible_for_correction" | "responsible_for_corrective_action";
  addText: string;
}

export const ResponsibleGroup = ({
  formData,
  setFormData,
  createLoading,
  fieldName,
  addText,
}: ResponsibleGroupProps) => {
  return (
    <ResponsiblePairs
      items={formData[fieldName] || [{ department: "", person: "" }]}
      setFormData={setFormData}
      createLoading={createLoading}
      fieldName={fieldName}
      addText={addText}
    />
  );
};

export default React.memo(ResponsibleGroup);
