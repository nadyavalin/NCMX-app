"use client";

import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchImprovements,
  deleteImprovementRequest,
  restoreImprovementRequest,
} from "@/api/improvementsApi";
import { AppDispatch, RootState } from "@store/store";
import ImprovementTable from "@components/ImprovementTable";

export const ArchiveImprovements = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { improvements, loading, error } = useSelector((state: RootState) => state.improvements);
  const archivedItems = improvements.filter((item) => item.is_archived);

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

  const handleRestore = useCallback(
    async (num_improvement: number) => {
      await dispatch(restoreImprovementRequest(num_improvement)).unwrap();
    },
    [dispatch],
  );

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  return (
    <div>
      <ImprovementTable
        title="Архив возможностей для улучшения"
        improvements={archivedItems}
        isLoading={loading}
        error={error}
        isArchived={true}
        onFetch={loadItems}
        onDelete={handleDelete}
        onRestore={handleRestore}
        showAddButton={false}
        showEditAction={false}
        showDeleteAction={false}
        showArchiveAction={false}
      />
    </div>
  );
};
