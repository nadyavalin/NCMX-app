"use client";

import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchImprovements, deleteImprovementRequest } from "@/api/improvementsApi";
import { AppDispatch, RootState } from "@store/store";
import ImprovementTable from "@components/ImprovementTable";

export const Improvements = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { improvements, loading, error } = useSelector((state: RootState) => state.improvements);
  const activeItems = improvements.filter((item) => !item.is_archived);

  const loadItems = useCallback(async () => {
    try {
      await dispatch(fetchImprovements()).unwrap();
    } catch (error: unknown) {
      console.log(error);
    }
  }, [dispatch]);

  const handleDelete = useCallback(
    async (num_improvement: number) => {
      await dispatch(deleteImprovementRequest(num_improvement)).unwrap();
    },
    [dispatch],
  );

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  return (
    <div>
      <ImprovementTable
        title="Реестр возможностей для улучшения по результатам внутренних аудитов СМК и внутренних технологических аудитов (в процессе выполнения)"
        improvements={activeItems}
        isLoading={loading}
        error={error}
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
