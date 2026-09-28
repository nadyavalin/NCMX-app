import React from "react";
import styles from "./../styles.module.css";
import { ImprovementRequestPOST, Responsible } from "@appTypes/types";
import { DynamicListForImprovement } from "../../helpers/DynamicList/forImprovement";
import { Departments } from "@components/lists/headFilters/Departments";
import { ResponsiblePersonsByDepartment } from "@components/lists/listsForModals/responsiblePersonsByDepartment";
import { departmentToPersonsMap } from "@components/lists/listsForModals/responsiblePersonsByDepartment/departmentToPersonsMap";

type ResponsibleFieldName = keyof ImprovementRequestPOST;

interface ResponsiblePairsForImprovementProps {
  items: Responsible[];
  setFormData: React.Dispatch<React.SetStateAction<ImprovementRequestPOST>>;
  createLoading: boolean;
  fieldName: "resp_persons_for_improvement_implementation";
  addText: string;
}

export const ResponsiblePairsForImprovement = ({
  items,
  setFormData,
  createLoading,
  fieldName,
  addText,
}: ResponsiblePairsForImprovementProps) => {
  const renderItem = (
    item: Responsible,
    index: number,
    handleChange: (
      event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
      index: number,
      fieldName: ResponsibleFieldName,
    ) => void,
    createLoading: boolean,
    fieldName: ResponsibleFieldName,
  ) => {
    const handleDepartmentChange = (event: React.ChangeEvent<HTMLSelectElement>, index: number) => {
      handleChange(event, index, fieldName);
    };

    const handlePersonChange = (event: React.ChangeEvent<HTMLSelectElement>, index: number) => {
      handleChange(event, index, fieldName);
    };

    return (
      <div className={styles.responsibleArea}>
        <Departments
          name="department"
          id={`department_${fieldName}_${index}`}
          value={item.department || ""}
          onChange={(e) => handleDepartmentChange(e, index)}
          disabled={createLoading}
        />
        {item.department && departmentToPersonsMap[item.department]?.length > 0 && (
          <ResponsiblePersonsByDepartment
            name="person"
            id={`person_${fieldName}_${index}`}
            value={item.person || ""}
            onChange={(e) => handlePersonChange(e, index)}
            disabled={createLoading}
            persons={departmentToPersonsMap[item.department]}
          />
        )}
      </div>
    );
  };

  return (
    <DynamicListForImprovement
      items={items}
      setFormData={setFormData}
      createLoading={createLoading}
      fieldName={fieldName}
      renderItem={renderItem}
      addItemText={addText}
      newItem={{ department: "", person: "" }}
      minItems={1}
      listBlockClassName={styles.responsibleArea}
    />
  );
};

export default React.memo(ResponsiblePairsForImprovement);
