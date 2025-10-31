"use client";

import { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@store/store";
import { fetchComments, fetchCommentsByNumNonconf } from "@/api"; // ← ОБНОВИТЬ ИМПОРТЫ
import { CommentContentType } from "@appTypes/types";

interface UseFetchCommentsOptions {
  content_type?: CommentContentType;
  object_id?: number | null;
  num_nonconf?: number | null;
  num_observation?: number | null;
}

export const useFetchComments = (options: UseFetchCommentsOptions) => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    comments,
    commentLoading: loading,
    commentError: error,
  } = useSelector((state: RootState) => state.comments);

  const fetchCommentsData = useCallback(async () => {
    const { content_type, object_id, num_nonconf, num_observation } = options;
    // Новый способ: по content_type и object_id
    if (content_type && object_id) {
      await dispatch(fetchComments({ content_type, object_id }));
    }
    // Обратная совместимость: по num_nonconf
    else if (num_nonconf) {
      await dispatch(fetchCommentsByNumNonconf(num_nonconf));
    }
    // Обратная совместимость: по num_observation
    else if (num_observation) {
      await dispatch(fetchComments({ content_type: "observation", object_id: num_observation }));
    }
  }, [dispatch, options]);

  useEffect(() => {
    fetchCommentsData();
  }, [fetchCommentsData]);

  return { comments, loading, error, refetch: fetchCommentsData };
};

// Хук для обратной совместимости (можно удалить после обновления всех компонентов)
export const useFetchCommentsItems = (currentInconsistencyNumber: number | null) => {
  return useFetchComments({ num_nonconf: currentInconsistencyNumber });
};

// Специализированные хуки для удобства
export const useFetchInconsistencyComments = (num_nonconf: number | null) => {
  return useFetchComments({
    content_type: "inconsistency",
    object_id: num_nonconf,
  });
};

export const useFetchObservationComments = (num_observation: number | null) => {
  return useFetchComments({
    content_type: "observation",
    object_id: num_observation,
  });
};
