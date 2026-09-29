"use client";

import styles from "./styles.module.css";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@store/store";
import { resetFilters, setFilter } from "@store/uiSlice";
import { ISORequirements } from "../ISOrequirements";
import { Regulations } from "../Regulations";
import { Departments } from "../Departments";
import { AllResponsiblePersons } from "../AllResponsiblePersons";
import { useState } from "react";

export const MainFilter = () => {
  const dispatch = useDispatch<AppDispatch>();
  const filters = useSelector((state: RootState) => state.ui.filters);
  const [selectedFilter, setSelectedFilter] = useState<string>("department");

  const handleMainFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFilter(e.target.value);
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
        {selectedFilter === "ISOrequirement" && (
          <ISORequirements
            value={filters.isoRequirement}
            onChange={(e) => dispatch(setFilter({ key: "isoRequirement", value: e.target.value }))}
          />
        )}
        {selectedFilter === "requirement" && (
          <Regulations
            value={filters.regulation}
            onChange={(e) => dispatch(setFilter({ key: "regulation", value: e.target.value }))}
          />
        )}
        {selectedFilter === "department" && (
          <Departments
            value={filters.department}
            onChange={(e) => dispatch(setFilter({ key: "department", value: e.target.value }))}
          />
        )}
        {selectedFilter === "responsiblePerson" && (
          <AllResponsiblePersons
            value={filters.responsiblePerson}
            onChange={(e) =>
              dispatch(setFilter({ key: "responsiblePerson", value: e.target.value }))
            }
          />
        )}
      </div>
      <button onClick={() => dispatch(resetFilters())} className={styles.resetButton}>
        Сбросить
      </button>
    </div>
  );
};
