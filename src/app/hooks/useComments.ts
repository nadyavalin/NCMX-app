"use client";

import { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@store/store";
import { fetchCommentsItems } from "@/api/commentsApi";

export const useFetchCommentsItems = (currentInconsistencyNumber: number | null) => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    comments,
    commentLoading: loading,
    commentError: error,
  } = useSelector((state: RootState) => state.comments);

  const fetchComments = useCallback(async () => {
    await dispatch(fetchCommentsItems(currentInconsistencyNumber));
  }, [dispatch, currentInconsistencyNumber]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  return { comments, loading, error, refetch: fetchComments };
};
