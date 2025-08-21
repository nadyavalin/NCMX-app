import styles from "../styles.module.css";
import { useState } from "react";
import { ISORequirements } from "../../lists/ISOrequirements";
import { Requirements } from "../../lists/requirements";
import { Departments } from "../../lists/departments";
import { AllResponsiblePersons } from "../../lists/allResponsiblePersons";

export const MainFilter = () => {
  const [selectedFilter, setSelectedFilter] = useState<string>("department");
  const [department, setDepartment] = useState<string>("");
  const [responsiblePerson, setResponsiblePerson] = useState<string>("");

  const handleMainFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFilter(e.target.value);
    setDepartment("");
    setResponsiblePerson("");
  };

  return (
    <div className={styles.filterContainer}>
      <select value={selectedFilter} onChange={handleMainFilterChange} className={styles.filter}>
        <option value="ISOrequirement">фильтр по требованиям ISO</option>
        <option value="requirement">фильтр по требованиям НД</option>
        <option value="department">фильтр по подразделению</option>
        <option value="responsiblePerson">фильтр по ответственному лицу</option>
      </select>

      <div className={styles.innerFilters}>
        {selectedFilter === "ISOrequirement" && <ISORequirements />}
        {selectedFilter === "requirement" && <Requirements />}
        {selectedFilter === "department" && (
          <Departments value={department} onChange={(e) => setDepartment(e.target.value)} />
        )}
        {selectedFilter === "responsiblePerson" && (
          <AllResponsiblePersons
            value={responsiblePerson}
            onChange={(e) => setResponsiblePerson(e.target.value)}
          />
        )}
      </div>
    </div>
  );
};
