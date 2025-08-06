import styles from "../styles.module.css";
import { useState } from "react";
import { InnerISORequirementsFilter } from "../innerFilters/ISOrequirements";
import { InnerRequirementsFilter } from "../innerFilters/requirements";
import { InnerDepartmentsFilter } from "../innerFilters/departments";
import { InnerRespPersonsFilter } from "../innerFilters/responsiblePersons";

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
