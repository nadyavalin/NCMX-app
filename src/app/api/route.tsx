import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { useEffect, useCallback } from "react";
import {
  APIResponse,
  APICommentsResponse,
  ItemResponseGET,
  ItemCommentResponseGET,
  ItemRequestPOST,
  ItemCommentRequestPOST,
} from "../../components/types";
import { handleApiError } from "../../utils/handleApiError";
import { RootState } from "../../store/store";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";

// Thunk для загрузки списка несоответствий
export const fetchItems = createAsyncThunk<
  ItemResponseGET[],
  { is_archived?: boolean } | void,
  { state: RootState }
>("num/fetchItems", async (params) => {
  try {
    const response = await api.get<APIResponse>("/ncmx-table/", {
      params: { is_archived: params?.is_archived },
    });
    return response.data.results || [];
  } catch (error: unknown) {
    const errorMessage = handleApiError(error, "Ошибка при получении списка несоответствий");
    throw new Error(errorMessage);
  }
});

// Thunk для создания несоответствия
export const createInconsistencyRequest = createAsyncThunk<
  ItemResponseGET,
  ItemRequestPOST,
  { state: RootState }
>("num/createInconsistency", async (formData) => {
  try {
    const response = await api.post<ItemResponseGET>("/ncmx-table/", formData);
    return response.data;
  } catch (error: unknown) {
    const errorMessage = handleApiError(error, "Ошибка при создании несоответствия");
    throw new Error(errorMessage);
  }
});

// Thunk для удаления несоответствия
export const deleteInconsistencyRequest = createAsyncThunk<void, number, { state: RootState }>(
  "num/deleteInconsistency",
  async (num_nonconf) => {
    try {
      await api.delete(`/ncmx-table/${num_nonconf}/`);
    } catch (error: unknown) {
      const errorMessage = handleApiError(error, "Ошибка при удалении несоответствия");
      throw new Error(errorMessage);
    }
  },
);

// Thunk для восстановления несоответствия
export const restoreInconsistencyRequest = createAsyncThunk<
  ItemResponseGET,
  number,
  { state: RootState }
>("num/restoreInconsistency", async (num_nonconf) => {
  try {
    const response = await api.post<ItemResponseGET>(`/ncmx-table/${num_nonconf}/restore/`);
    return response.data;
  } catch (error: unknown) {
    const errorMessage = handleApiError(error, "Ошибка при восстановлении несоответствия");
    throw new Error(errorMessage);
  }
});

// Thunk для обновления несоответствия
export const updateInconsistencyRequest = createAsyncThunk<
  ItemResponseGET,
  { num_nonconf: number; data: Partial<ItemRequestPOST> },
  { state: RootState }
>("num/updateInconsistency", async ({ num_nonconf, data }) => {
  try {
    const response = await api.patch<ItemResponseGET>(`/ncmx-table/${num_nonconf}/`, data);
    return response.data;
  } catch (error: unknown) {
    const errorMessage = handleApiError(error, "Ошибка при обновлении несоответствия");
    throw new Error(errorMessage);
  }
});

// Thunk для создания комментария
export const createCommentInconsistencyRequest = createAsyncThunk<
  ItemCommentResponseGET,
  ItemCommentRequestPOST,
  { state: RootState }
>("num/createCommentInconsistency", async (formData) => {
  try {
    const response = await api.post<ItemCommentResponseGET>("/ncmx-comments/", formData);
    return response.data;
  } catch (error: unknown) {
    const errorMessage = handleApiError(error, "Ошибка при создании комментария");
    throw new Error(errorMessage);
  }
});

// Thunk для обновления комментария
export const updateCommentInconsistencyRequest = createAsyncThunk<
  ItemCommentResponseGET,
  { id: number; data: ItemCommentRequestPOST },
  { state: RootState }
>("num/updateCommentInconsistency", async ({ id, data }) => {
  try {
    const response = await api.patch<ItemCommentResponseGET>(`/ncmx-comments/${id}/`, data);
    return response.data;
  } catch (error: unknown) {
    const errorMessage = handleApiError(error, "Ошибка при обновлении комментария");
    throw new Error(errorMessage);
  }
});

// Thunk для загрузки комментариев
export const fetchCommentsItems = createAsyncThunk<
  ItemCommentResponseGET[],
  number | null,
  { state: RootState }
>("num/fetchCommentsItems", async (num_nonconf) => {
  if (num_nonconf === null) {
    return [];
  }
  try {
    const response = await api.get<APICommentsResponse>("/ncmx-comments/", {
      params: { num_nonconf },
    });
    return response.data.results || [];
  } catch (error: unknown) {
    const errorMessage = handleApiError(error, "Ошибка при получении комментариев");
    throw new Error(errorMessage);
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
