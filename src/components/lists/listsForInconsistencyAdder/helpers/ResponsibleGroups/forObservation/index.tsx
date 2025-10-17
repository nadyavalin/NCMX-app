import React from "react";
import { ObservationRequestPOST } from "@appTypes/types";
import { ResponsiblePairsForObservation } from "../../../ResponsiblePairs/forObservation";

interface ResponsibleGroupForObservationProps {
  formData: ObservationRequestPOST;
  setFormData: React.Dispatch<React.SetStateAction<ObservationRequestPOST>>;
  createLoading: boolean;
  fieldName: "solutions";
  addText: string;
  solutionIndex: number;
}

export const ResponsibleGroupForObservation = ({
  formData,
  setFormData,
  createLoading,
  addText,
  solutionIndex,
}: ResponsibleGroupForObservationProps) => {
  const items = formData.solutions?.[solutionIndex]?.responsible_for_solution || [
    { department: "", person: "" },
  ];
  return (
    <ResponsiblePairsForObservation
      items={items}
      setFormData={setFormData}
      createLoading={createLoading}
      fieldName="responsible_for_solution"
      addText={addText}
      solutionIndex={solutionIndex}
    />
  );
};

export default React.memo(ResponsibleGroupForObservation);
