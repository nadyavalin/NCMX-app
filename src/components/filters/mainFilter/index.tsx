import styles from "../styles.module.css";
import { useState } from "react";
import { ISORequirements } from "../../lists/ISOrequirements";
import { Requirements } from "../../lists/requirements";
import { Departments } from "../../lists/departments";
import { RespPersons } from "../../lists/responsiblePersons";

export const MainFilter = () => {
  const [selectedFilter, setSelectedFilter] = useState<string>("department");

  const handleMainFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFilter(e.target.value);
  };

  return (
    <div className={styles.filterContainer}>
      <select className={styles.filter} value={selectedFilter} onChange={handleMainFilterChange}>
        <option value="ISOrequirement">фильтр по требованиям ISO</option>
        <option value="requirement">фильтр по требованиям НД</option>
        <option value="department">фильтр по подразделению</option>
        <option value="responsiblePerson">фильтр по ответственному лицу</option>
      </select>

      <div className={styles.innerFilters}>
        {selectedFilter === "ISOrequirement" && <ISORequirements />}
        {selectedFilter === "requirement" && <Requirements />}
        {selectedFilter === "department" && <Departments />}
        {selectedFilter === "responsiblePerson" && <RespPersons />}
      </div>
    </div>
  );
};
