import React from "react";
import { ImprovementRequestPOST } from "@appTypes/types";
import { ResponsiblePairsForImprovement } from "@components/lists/listsForModals/ResponsiblePairs/forImprovement";

interface ResponsibleGroupForImprovementProps {
  formData: ImprovementRequestPOST;
  setFormData: React.Dispatch<React.SetStateAction<ImprovementRequestPOST>>;
  createLoading: boolean;
  fieldName: "resp_persons_for_improvement_implementation";
  addText: string;
  responsibleIndex: number;
}

export const ResponsibleGroupForImprovement = ({
  formData,
  setFormData,
  createLoading,
  addText,
}: ResponsibleGroupForImprovementProps) => {
  const items = formData.resp_persons_for_improvement_implementation || [
    { department: "", person: "" },
  ];

  return (
    <ResponsiblePairsForImprovement
      items={items}
      setFormData={setFormData}
      createLoading={createLoading}
      fieldName="resp_persons_for_improvement_implementation"
      addText={addText}
    />
  );
};

export default React.memo(ResponsibleGroupForImprovement);
