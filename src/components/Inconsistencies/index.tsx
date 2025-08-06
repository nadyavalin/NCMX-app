"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store/store";
import { fetchItems, deleteInconsistencyRequest } from "@api/route";
import { InconsistencyTable } from "@components/InconsistencyTable";

export const Inconsistencies = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { activeItems, itemsLoading, itemsError } = useSelector((state: RootState) => state.num);

  useEffect(() => {
    const loadItems = async () => {
      try {
        await dispatch(fetchItems({ is_archived: false })).unwrap();
      } catch (error: unknown) {
        console.log(error);
      }
    };
    loadItems();
  }, [dispatch]);

  const handleDelete = async (num_nonconf: number) => {
    await dispatch(deleteInconsistencyRequest(num_nonconf)).unwrap();
  };

  return (
    <InconsistencyTable
      title="Реестр несоответствий по результатам внутренних аудитов СМК и внутренних технологических аудитов"
      items={activeItems}
      isLoading={itemsLoading}
      error={itemsError}
      isArchived={false}
      onFetch={() => dispatch(fetchItems({ is_archived: false }))}
      onDelete={handleDelete}
      showAddButton={true}
      showEditAction={true}
      showDeleteAction={true}
      showEstimateAction={true}
    />
  );
};

export default Inconsistencies;
