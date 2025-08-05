import { useState } from "react";
import { InnerRequirementsFilter } from "../innerFilters/requirements";
import { InnerISORequirementsFilter } from "../innerFilters/ISOrequirements";
import { InnerDepartmentsFilter } from "../innerFilters/departments";
import { InnerRespPersonsFilter } from "../innerFilters/responsiblePersons";
import styles from "../styles.module.css";

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
        {selectedFilter === "ISOrequirement" && <InnerISORequirementsFilter />}
        {selectedFilter === "requirement" && <InnerRequirementsFilter />}
        {selectedFilter === "department" && <InnerDepartmentsFilter />}
        {selectedFilter === "responsiblePerson" && <InnerRespPersonsFilter />}
      </div>
    </div>
  );
};
