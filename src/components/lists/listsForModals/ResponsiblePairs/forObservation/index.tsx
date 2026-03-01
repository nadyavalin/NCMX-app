import React from "react";
import styles from "./../styles.module.css";
import { Solution, ObservationRequestPOST, Responsible } from "@appTypes/types";
import { DynamicListForObservation } from "../../helpers/DynamicList/forObservation";
import { Departments } from "@components/lists/headFilters/Departments";
import { ResponsiblePersonsByDepartment } from "@components/lists/listsForModals/responsiblePersonsByDepartment";
import { departmentToPersonsMap } from "@components/lists/listsForModals/responsiblePersonsByDepartment/departmentToPersonsMap";

type ResponsibleFieldName = keyof ObservationRequestPOST | keyof Solution;

interface ResponsiblePairsForObservationProps {
  items: Responsible[];
  setFormData: React.Dispatch<React.SetStateAction<ObservationRequestPOST>>;
  createLoading: boolean;
  fieldName: "responsible_for_solution";
  addText: string;
  solutionIndex: number;
}

export const ResponsiblePairsForObservation = ({
  items,
  setFormData,
  createLoading,
  fieldName,
  addText,
  solutionIndex,
}: ResponsiblePairsForObservationProps) => {
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
          id={`department_${fieldName}_${solutionIndex}_${index}`}
          value={item.department || ""}
          onChange={(e) => handleDepartmentChange(e, index)}
          disabled={createLoading}
        />
        {item.department && departmentToPersonsMap[item.department]?.length > 0 && (
          <ResponsiblePersonsByDepartment
            name="person"
            id={`person_${fieldName}_${solutionIndex}_${index}`}
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
    <DynamicListForObservation
      items={items}
      setFormData={setFormData}
      createLoading={createLoading}
      fieldName={fieldName}
      renderItem={renderItem}
      addItemText={addText}
      newItem={{ department: "", person: "" }}
      minItems={1}
      listBlockClassName={styles.responsibleArea}
      parentFieldName={fieldName === "responsible_for_solution" ? "solutions" : undefined}
      parentIndex={solutionIndex}
    />
  );
};

export default React.memo(ResponsiblePairsForObservation);
