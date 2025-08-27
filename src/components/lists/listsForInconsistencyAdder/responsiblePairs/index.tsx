import React from "react";
import styles from "./styles.module.css";
import { ItemRequestPOST, Responsible } from "@appTypes/types";
import { DynamicList } from "../helpers/DynamicList";
import { Departments } from "@components/lists/headFilters/Departments";
import { ResponsiblePersonsByDepartment } from "@components/lists/listsForInconsistencyAdder/responsiblePersonsByDepartment";
import { departmentToPersonsMap } from "@components/lists/listsForInconsistencyAdder/responsiblePersonsByDepartment/departmentToPersonsMap";

interface ResponsiblePairsProps {
  items: Responsible[];
  setFormData: React.Dispatch<React.SetStateAction<ItemRequestPOST>>;
  createLoading: boolean;
  fieldName: "responsible_for_correction" | "responsible_for_corrective_action";
  addText: string;
}

export const ResponsiblePairs = ({
  items,
  setFormData,
  createLoading,
  fieldName,
  addText,
}: ResponsiblePairsProps) => {
  const renderItem = (
    item: Responsible,
    index: number,
    handleChange: (
      event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
      index: number,
    ) => void,
    createLoading: boolean,
  ) => {
    const handleDepartmentChange = (event: React.ChangeEvent<HTMLSelectElement>, index: number) => {
      const { value } = event.target;
      setFormData((prevData) => {
        const updatedItems = [...(prevData[fieldName] as Responsible[])];
        updatedItems[index] = {
          ...updatedItems[index],
          department: value || "",
          person: "",
        };
        return { ...prevData, [fieldName]: updatedItems };
      });
    };

    return (
      <div className={styles.respCorrectArea}>
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
            onChange={(e) => handleChange(e, index)}
            disabled={createLoading}
            persons={departmentToPersonsMap[item.department]}
          />
        )}
      </div>
    );
  };

  return (
    <DynamicList<Responsible>
      items={items}
      setFormData={setFormData}
      createLoading={createLoading}
      fieldName={fieldName}
      renderItem={renderItem}
      addItemText={addText}
      newItem={{ department: "", person: "" }}
      minItems={1}
      listBlockClassName={styles.respCorrectArea}
    />
  );
};

export default React.memo(ResponsiblePairs);
