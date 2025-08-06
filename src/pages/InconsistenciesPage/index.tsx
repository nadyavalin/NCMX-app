"use client";

import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchItems, deleteInconsistencyRequest } from "@api/route";
import { RootState, AppDispatch } from "@store/store";
import InconsistencyTable from "@components/InconsistencyTable";

export const Inconsistencies = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { activeItems, itemsLoading, itemsError } = useSelector((state: RootState) => state.num);

  const loadItems = useCallback(async () => {
    try {
      await dispatch(fetchItems({ is_archived: false })).unwrap();
    } catch (error: unknown) {
      console.log(error);
    }
  }, [dispatch]);

  const handleDelete = useCallback(
    async (num_nonconf: number) => {
      await dispatch(deleteInconsistencyRequest(num_nonconf)).unwrap();
    },
    [dispatch],
  );

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  return (
    <InconsistencyTable
      title="Реестр несоответствий по результатам внутренних аудитов СМК и внутренних технологических аудитов"
      items={activeItems}
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

export default Inconsistencies;
