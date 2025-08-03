import { useState } from "react";
import { InnerDepartmentsFilter } from "../innerFilters/departments";
import { InnerRequirementsFilter } from "../innerFilters/requirements";
import { InnerRespPersonsFilter } from "../innerFilters/responsiblePersons";
import styles from "../styles.module.css";

export const MainFilter = () => {
  const [selectedFilter, setSelectedFilter] = useState<string>("requirement");

  const handleMainFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFilter(e.target.value);
  };

  return (
    <div className={styles.filterContainer}>
      <select className={styles.filter} value={selectedFilter} onChange={handleMainFilterChange}>
        <option value="requirement">фильтр по требованиям НД</option>
        <option value="department">фильтр по подразделению</option>
        <option value="responsiblePerson">фильтр по ответственному лицу</option>
      </select>

      <div className={styles.innerFilters}>
        {selectedFilter === "requirement" && <InnerRequirementsFilter />}
        {selectedFilter === "department" && <InnerDepartmentsFilter />}
        {selectedFilter === "responsiblePerson" && <InnerRespPersonsFilter />}
      </div>
    </div>
  );
};
