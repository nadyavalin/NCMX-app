"use client";

import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNonconformities, deleteNonconformityRequest } from "@/api";
import { RootState, AppDispatch } from "@store/store";
import NonconformityTable from "@components/NonconformityTable";

export const Nonconformities = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { activeItems, itemsLoading, itemsError } = useSelector(
    (state: RootState) => state.nonconformities,
  );

  const loadItems = useCallback(async () => {
    try {
      await dispatch(fetchNonconformities({ is_archived: false })).unwrap();
    } catch (error: unknown) {
      console.log(error);
    }
  }, [dispatch]);

  const handleDelete = useCallback(
    async (num_nonconf: number) => {
      await dispatch(deleteNonconformityRequest(num_nonconf)).unwrap();
    },
    [dispatch],
  );

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  return (
    <NonconformityTable
      title="Реестр несоответствий по результатам внутренних аудитов СМК и внутренних технологических аудитов (в процессе выполнения)"
      nonconformities={activeItems}
      isLoading={itemsLoading}
      error={itemsError}
      isArchived={false}
      onFetch={loadItems}
      onDelete={handleDelete}
      showAddButton={true}
      showEditAction={true}
      showDeleteAction={true}
      showEstimateAction={true}
    />
  );
};

export default Nonconformities;
