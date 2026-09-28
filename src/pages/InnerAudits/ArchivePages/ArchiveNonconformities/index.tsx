"use client";

import styles from "../styles.module.css";
import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@store/store";
import { fetchNonconformities, restoreNonconformityRequest } from "@/api";
import NonconformityTable from "@components/NonconformityTable";

export const ArchiveNonconformities = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { archivedItems, itemsLoading, itemsError } = useSelector(
    (state: RootState) => state.nonconformities,
  );

  const loadItems = useCallback(async () => {
    try {
      await dispatch(fetchNonconformities({ is_archived: true })).unwrap();
    } catch (error: unknown) {
      console.log(error);
    }
  }, [dispatch]);

  const handleRestore = useCallback(
    async (num_nonconf: number) => {
      await dispatch(restoreNonconformityRequest(num_nonconf)).unwrap();
    },
    [dispatch],
  );

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  return (
    <div className={styles.archiveBlock}>
      <NonconformityTable
        title="Архив несоответствий по результатам внутренних аудитов СМК и внутренних технологических аудитов"
        nonconformities={archivedItems}
        isLoading={itemsLoading}
        error={itemsError}
        isArchived={true}
        onFetch={loadItems}
        onRestore={handleRestore}
      />
    </div>
  );
};

export default ArchiveNonconformities;
