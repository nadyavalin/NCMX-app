"use client";

import { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { isAxiosError } from "axios";
import api from "@utils/api";
import { RootState, AppDispatch } from "@store/store";
import {
  APIResponse,
  APICommentsResponse,
  ItemResponseGET,
  ItemCommentResponseGET,
  ItemRequestPOST,
  ItemCommentRequestPOST,
} from "../../types/types";

// Thunk для загрузки списка несоответствий
export const fetchItems = createAsyncThunk<
  ItemResponseGET[],
  { is_archived?: boolean } | void,
  { state: RootState }
>("num/fetchItems", async (params, { rejectWithValue }) => {
  try {
    const response = await api.get<APIResponse>("/ncmx-table/", {
      params: { is_archived: params?.is_archived },
    });
    return response.data.results || [];
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.detail || "Ошибка при получении списка несоответствий";
      return rejectWithValue(errorMessage);
    }
    return rejectWithValue("Ошибка при получении списка несоответствий");
  }
});

// Thunk для создания несоответствия
export const createInconsistencyRequest = createAsyncThunk<
  ItemResponseGET,
  ItemRequestPOST,
  { state: RootState }
>("num/createInconsistency", async (formData, { rejectWithValue }) => {
  try {
    const response = await api.post<ItemResponseGET>("/ncmx-table/", formData);
    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error) && error.response?.status === 400) {
      const serverMessage =
        error.response?.data?.num_nonconf?.[0] ||
        error.response?.data?.detail ||
        "Ошибка при создании несоответствия";
      if (
        serverMessage.toLowerCase().includes("already exists") ||
        serverMessage.toLowerCase().includes("уже существует") ||
        serverMessage.toLowerCase().includes("duplicate")
      ) {
        const errorMessage = `Несоответствие с номером ${formData.num_nonconf} уже существует`;
        return rejectWithValue(errorMessage);
      }
      return rejectWithValue(serverMessage);
    }
    return rejectWithValue("Ошибка при создании несоответствия");
  }
});

// Thunk для удаления несоответствия
export const deleteInconsistencyRequest = createAsyncThunk<void, number, { state: RootState }>(
  "num/deleteInconsistency",
  async (num_nonconf, { rejectWithValue }) => {
    try {
      await api.delete(`/ncmx-table/${num_nonconf}/`);
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const errorMessage = error.response?.data?.detail || "Ошибка при удалении несоответствия";
        return rejectWithValue(errorMessage);
      }
      return rejectWithValue("Ошибка при удалении несоответствия");
    }
  },
);

// Thunk для восстановления несоответствия
export const restoreInconsistencyRequest = createAsyncThunk<
  ItemResponseGET,
  number,
  { state: RootState }
>("num/restoreInconsistency", async (num_nonconf, { rejectWithValue }) => {
  try {
    const response = await api.post<ItemResponseGET>(`/ncmx-table/${num_nonconf}/restore/`);
    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.detail || "Ошибка при восстановлении несоответствия";
      return rejectWithValue(errorMessage);
    }
    return rejectWithValue("Ошибка при восстановлении несоответствия");
  }
});

// Thunk для обновления несоответствия
export const updateInconsistencyRequest = createAsyncThunk<
  ItemResponseGET,
  { num_nonconf: number; data: Partial<ItemRequestPOST> },
  { state: RootState }
>("num/updateInconsistency", async ({ num_nonconf, data }, { rejectWithValue }) => {
  try {
    const response = await api.patch<ItemResponseGET>(`/ncmx-table/${num_nonconf}/`, data);
    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      const errorMessage = error.response?.data?.detail || "Ошибка при обновлении несоответствия";
      return rejectWithValue(errorMessage);
    }
    return rejectWithValue("Ошибка при обновлении несоответствия");
  }
});

// Thunk для создания комментария
export const createCommentInconsistencyRequest = createAsyncThunk<
  ItemCommentResponseGET,
  ItemCommentRequestPOST,
  { state: RootState }
>("num/createCommentInconsistency", async (formData, { rejectWithValue }) => {
  try {
    const response = await api.post<ItemCommentResponseGET>("/ncmx-comments/", formData);
    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      const errorMessage = error.response?.data?.detail || "Ошибка при создании комментария";
      return rejectWithValue(errorMessage);
    }
    return rejectWithValue("Ошибка при создании комментария");
  }
});

// Thunk для обновления комментария
export const updateCommentInconsistencyRequest = createAsyncThunk<
  ItemCommentResponseGET,
  { id: number; data: ItemCommentRequestPOST },
  { state: RootState }
>("num/updateCommentInconsistency", async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await api.patch<ItemCommentResponseGET>(`/ncmx-comments/${id}/`, data);
    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      const errorMessage = error.response?.data?.detail || "Ошибка при обновлении комментария";
      return rejectWithValue(errorMessage);
    }
    return rejectWithValue("Ошибка при обновлении комментария");
  }
});

// Thunk для загрузки комментариев
export const fetchCommentsItems = createAsyncThunk<
  ItemCommentResponseGET[],
  number | null,
  { state: RootState }
>("num/fetchCommentsItems", async (num_nonconf, { rejectWithValue }) => {
  if (num_nonconf === null) {
    return [];
  }
  try {
    const response = await api.get<APICommentsResponse>("/ncmx-comments/", {
      params: { num_nonconf },
    });
    return response.data.results || [];
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      const errorMessage = error.response?.data?.detail || "Ошибка при получении комментариев";
      return rejectWithValue(errorMessage);
    }
    return rejectWithValue("Ошибка при получении комментариев");
  }
});

// Хук для загрузки комментариев
export const useFetchCommentsItems = (currentInconsistencyNumber: number | null) => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    comments,
    commentLoading: loading,
    commentError: error,
  } = useSelector((state: RootState) => state.num);

  const fetchComments = useCallback(async () => {
    await dispatch(fetchCommentsItems(currentInconsistencyNumber));
  }, [dispatch, currentInconsistencyNumber]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  return { comments, loading, error, refetch: fetchComments };
};
