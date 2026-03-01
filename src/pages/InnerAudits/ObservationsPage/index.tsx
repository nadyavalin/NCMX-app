"use client";

import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchObservations, deleteObservationRequest } from "@/api";
import { AppDispatch, RootState } from "@store/store";
import ObservationTable from "@components/ObservationTable";
import "@/globals.css";

export const Observations = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { activeItems, itemsLoading, itemsError } = useSelector(
    (state: RootState) => state.observations,
  );

  const loadItems = useCallback(async () => {
    try {
      await dispatch(fetchObservations({ is_archived: false })).unwrap();
    } catch (error: unknown) {
      console.log(error);
    }
  }, [dispatch]);

  const handleDelete = useCallback(
    async (num_observation: number) => {
      await dispatch(deleteObservationRequest(num_observation)).unwrap();
    },
    [dispatch],
  );

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  return (
    <div>
      <ObservationTable
        title="Наблюдения по результатам внутренних аудитов СМК и внутренних технологических аудитов (в процессе выполнения)"
        observations={activeItems}
        isLoading={itemsLoading}
        error={itemsError}
        isArchived={false}
        onFetch={loadItems}
        onDelete={handleDelete}
        showAddButton={true}
        showEditAction={true}
        showDeleteAction={true}
        showArchiveAction={true}
      />
    </div>
  );
};
