import React from "react";
import styles from "./../styles.module.css";
import {
  Correction,
  CorrectiveAction,
  InconsistencyRequestPOST,
  Responsible,
} from "@appTypes/types";
import { DynamicListForInconsistency } from "../../helpers/DynamicList/forInconsistency";
import { Departments } from "@components/lists/headFilters/Departments";
import { ResponsiblePersonsByDepartment } from "@components/lists/listsForModals/responsiblePersonsByDepartment";
import { departmentToPersonsMap } from "@components/lists/listsForModals/responsiblePersonsByDepartment/departmentToPersonsMap";

type FieldName = keyof InconsistencyRequestPOST | keyof Correction | keyof CorrectiveAction;

interface ResponsiblePairsForInconsistencyProps {
  items: Responsible[];
  setFormData: React.Dispatch<React.SetStateAction<InconsistencyRequestPOST>>;
  createLoading: boolean;
  fieldName: "responsible_for_correction" | "responsible_for_corrective_action";
  addText: string;
  correctionIndex: number;
}

export const ResponsiblePairsForInconsistency = ({
  items,
  setFormData,
  createLoading,
  fieldName,
  addText,
  correctionIndex,
}: ResponsiblePairsForInconsistencyProps) => {
  const renderItem = (
    item: Responsible,
    index: number,
    handleChange: (
      event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
      index: number,
      fieldName: FieldName,
    ) => void,
    createLoading: boolean,
    fieldName: FieldName,
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
          id={`department_${fieldName}_${correctionIndex}_${index}`}
          value={item.department || ""}
          onChange={(e) => handleDepartmentChange(e, index)}
          disabled={createLoading}
        />
        {item.department && departmentToPersonsMap[item.department]?.length > 0 && (
          <ResponsiblePersonsByDepartment
            name="person"
            id={`person_${fieldName}_${correctionIndex}_${index}`}
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
    <DynamicListForInconsistency
      items={items}
      setFormData={setFormData}
      createLoading={createLoading}
      fieldName={fieldName}
      renderItem={renderItem}
      addItemText={addText}
      newItem={{ department: "", person: "" }}
      minItems={1}
      listBlockClassName={styles.respCorrectArea}
      parentFieldName={
        fieldName === "responsible_for_correction" ? "corrections" : "corrective_actions"
      }
      parentIndex={correctionIndex}
    />
  );
};

export default React.memo(ResponsiblePairsForInconsistency);
