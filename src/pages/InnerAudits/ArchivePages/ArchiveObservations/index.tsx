"use client";

import styles from "../styles.module.css";
import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@store/store";
import { fetchObservations, restoreObservationRequest } from "@/api";
import ObservationTable from "@components/ObservationTable";

export const ArchiveObservations = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { archivedItems, itemsLoading, itemsError } = useSelector(
    (state: RootState) => state.observations,
  );

  const loadItems = useCallback(async () => {
    try {
      await dispatch(fetchObservations({ is_archived: true })).unwrap();
    } catch (error: unknown) {
      console.log(error);
    }
  }, [dispatch]);

  const handleRestore = useCallback(
    async (num_observation: number) => {
      await dispatch(restoreObservationRequest(num_observation)).unwrap();
    },
    [dispatch],
  );

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  return (
    <div className={styles.archiveBlock}>
      <ObservationTable
        title="Архив наблюдений по результатам внутренних аудитов СМК и внутренних технологических аудитов"
        observations={archivedItems}
        isLoading={itemsLoading}
        error={itemsError}
        isArchived={true}
        onFetch={loadItems}
        onRestore={handleRestore}
        showAddButton={false}
        showEditAction={false}
        showDeleteAction={false}
      />
    </div>
  );
};

export default ArchiveObservations;
