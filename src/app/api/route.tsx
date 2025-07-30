import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { useEffect, useState } from "react";
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

// Thunk для загрузки списка несоответствий
export const fetchItems = createAsyncThunk<ItemResponseGET[], void, { state: RootState }>(
  "num/fetchItems",
  async () => {
    try {
      const response = await api.get<APIResponse>("/ncmx-table/");
      return response.data.results || [];
    } catch (error: unknown) {
      const errorMessage = handleApiError(error, "Ошибка при получении списка несоответствий");
      throw new Error(errorMessage);
    }
  },
);

// Thunk для удаления несоответствия
export const deleteInconsistencyRequest = createAsyncThunk<void, number, { state: RootState }>(
  "num/deleteInconsistency",
  async (num_nonconf) => {
    try {
      await api.delete(`/ncmx-table/${num_nonconf}/delete/`);
    } catch (error: unknown) {
      const errorMessage = handleApiError(error, "Ошибка при удалении несоответствия");
      throw new Error(errorMessage);
    }
  },
);

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

// Функция для отправки нового несоответствия
export const sendInconsistencyRequest = async (
  formData: ItemRequestPOST,
): Promise<ItemResponseGET> => {
  try {
    const response = await api.post<ItemResponseGET>("/ncmx-table/", formData);
    console.log(`Successfully created inconsistency: ${response.data.num_nonconf}`, response.data);
    return response.data;
  } catch (error: unknown) {
    const errorMessage = handleApiError(error, "Ошибка при отправке формы");
    throw new Error(errorMessage);
  }
};

// Хук для загрузки комментариев
export const useFetchCommentsItems = (currentInconsistencyNumber: number | null) => {
  const [comments, setComments] = useState<ItemCommentResponseGET[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      if (currentInconsistencyNumber === null) {
        setComments([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await api.get<APICommentsResponse>("/ncmx-comments/", {
          params: { num_nonconf: currentInconsistencyNumber },
        });
        setComments(response.data.results || []);
      } catch (error: unknown) {
        const errorMessage = handleApiError(error, "Ошибка при получении комментариев");
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [currentInconsistencyNumber]);

  return { comments, loading, error };
};

// Функция для отправки комментария
export const sendCommentInconsistencyRequest = async (
  formData: ItemCommentRequestPOST,
): Promise<ItemCommentResponseGET> => {
  try {
    const response = await api.post<ItemCommentResponseGET>("/ncmx-comments/", formData);
    console.log("Success: ", response.data);
    return response.data;
  } catch (error: unknown) {
    const errorMessage = handleApiError(error, "Ошибка при отправке комментария");
    throw new Error(errorMessage);
  }
};
