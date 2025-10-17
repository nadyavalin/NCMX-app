"use client";

import styles from "../styles.module.css";
import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@store/store";
import { fetchInconsistencies, restoreInconsistencyRequest } from "@/api";
import InconsistencyTable from "@components/InconsistencyTable";

export const ArchiveInconsistencies = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { archivedItems, itemsLoading, itemsError } = useSelector(
    (state: RootState) => state.inconsistencies,
  );

  const loadItems = useCallback(async () => {
    try {
      await dispatch(fetchInconsistencies({ is_archived: true })).unwrap();
    } catch (error: unknown) {
      console.log(error);
    }
  }, [dispatch]);

  const handleRestore = useCallback(
    async (num_nonconf: number) => {
      await dispatch(restoreInconsistencyRequest(num_nonconf)).unwrap();
    },
    [dispatch],
  );

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  return (
    <div className={styles.archiveBlock}>
      <InconsistencyTable
        title="Архив несоответствий по результатам внутренних аудитов СМК и внутренних технологических аудитов"
        inconsistencies={archivedItems}
        isLoading={itemsLoading}
        error={itemsError}
        isArchived={true}
        onFetch={loadItems}
        onRestore={handleRestore}
      />
    </div>
  );
};

export default ArchiveInconsistencies;
