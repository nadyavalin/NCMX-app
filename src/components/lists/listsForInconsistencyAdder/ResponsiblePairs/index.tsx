import React from "react";
import styles from "./styles.module.css";
import { ItemRequestPOST, Responsible } from "@appTypes/types";
import { DynamicList } from "../helpers/DynamicLists";
import { Departments } from "@components/lists/headFilters/Departments";
import { ResponsiblePersonsByDepartment } from "@components/lists/listsForInconsistencyAdder/responsiblePersonsByDepartment";
import { departmentToPersonsMap } from "@components/lists/listsForInconsistencyAdder/responsiblePersonsByDepartment/departmentToPersonsMap";

interface ResponsiblePairsProps {
  items: Responsible[];
  setFormData: React.Dispatch<React.SetStateAction<ItemRequestPOST>>;
  createLoading: boolean;
  fieldName: "responsible_for_correction" | "responsible_for_corrective_action";
  addText: string;
  correctionIndex: number;
}

export const ResponsiblePairs = ({
  items,
  setFormData,
  createLoading,
  fieldName,
  addText,
  correctionIndex,
}: ResponsiblePairsProps) => {
  const renderItem = (
    item: Responsible,
    index: number,
    handleChange: (
      event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
      index: number,
      fieldName: keyof ItemRequestPOST,
    ) => void,
    createLoading: boolean,
    // parentFieldName: keyof ItemRequestPOST,
  ) => {
    const handleDepartmentChange = (event: React.ChangeEvent<HTMLSelectElement>, index: number) => {
      const { value } = event.target;
      setFormData((prevData) => {
        const parentItems = [
          ...(prevData[
            fieldName === "responsible_for_correction" ? "corrections" : "corrective_actions"
          ] as unknown[]),
        ];
        const updatedItems = [...((parentItems[correctionIndex] as unknown)[fieldName] || [])];
        updatedItems[index] = {
          ...updatedItems[index],
          department: value || "",
          person: "",
        };
        parentItems[correctionIndex] = {
          ...parentItems[correctionIndex],
          [fieldName]: updatedItems,
        };
        return {
          ...prevData,
          [fieldName === "responsible_for_correction" ? "corrections" : "corrective_actions"]:
            parentItems,
        };
      });
    };

    const handlePersonChange = (event: React.ChangeEvent<HTMLSelectElement>, index: number) => {
      const { value } = event.target;
      setFormData((prevData) => {
        const parentItems = [
          ...(prevData[
            fieldName === "responsible_for_correction" ? "corrections" : "corrective_actions"
          ] as unknown[]),
        ];
        const updatedItems = [...((parentItems[correctionIndex] as unknown)[fieldName] || [])];
        updatedItems[index] = {
          ...updatedItems[index],
          person: value || "",
        };
        parentItems[correctionIndex] = {
          ...parentItems[correctionIndex],
          [fieldName]: updatedItems,
        };
        return {
          ...prevData,
          [fieldName === "responsible_for_correction" ? "corrections" : "corrective_actions"]:
            parentItems,
        };
      });
    };

    return (
      <div className={styles.respCorrectArea}>
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
    <DynamicList
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

export default React.memo(ResponsiblePairs);
