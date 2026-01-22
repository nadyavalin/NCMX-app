import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@utils/api";
import { RootState } from "@store/store";
import { RescheduleCommentRequestPOST, RescheduleCommentResponseGET } from "@appTypes/types";
import { handleApiCommentError } from "@utils/handleApiError";

export type RescheduleCommentContentType = "nonconformity" | "observation" | "improvement";

// Интерфейс для ответа API
interface APIRescheduleCommentsResponse {
  results: RescheduleCommentResponseGET[];
  count?: number;
  next?: string | null;
  previous?: string | null;
}

// Универсальная функция загрузки комментариев о переносе сроков
export const fetchRescheduleComments = createAsyncThunk<
  RescheduleCommentResponseGET[],
  { content_type: RescheduleCommentContentType; object_id: number } | null,
  { state: RootState }
>("rescheduleComments/fetchRescheduleComments", async (params, { rejectWithValue }) => {
  if (params === null) {
    return [];
  }
  try {
    const response = await api.get<APIRescheduleCommentsResponse>("/reschedule-comments/", {
      params: {
        content_type: params.content_type,
        object_id: params.object_id,
      },
    });
    return response.data.results || [];
  } catch (error: unknown) {
    return rejectWithValue(
      handleApiCommentError(error, "Ошибка при получении комментариев о переносе"),
    );
  }
});

// Создание комментария о переносе сроков
export const createRescheduleCommentRequest = createAsyncThunk<
  RescheduleCommentResponseGET,
  RescheduleCommentRequestPOST,
  { state: RootState }
>("rescheduleComments/createRescheduleComment", async (formData, { rejectWithValue }) => {
  try {
    const response = await api.post<RescheduleCommentResponseGET>(
      "/reschedule-comments/",
      formData,
    );
    return response.data;
  } catch (error: unknown) {
    return rejectWithValue(
      handleApiCommentError(error, "Ошибка при создании комментария о переносе"),
    );
  }
});

// Обновление комментария о переносе сроков
export const updateRescheduleCommentRequest = createAsyncThunk<
  RescheduleCommentResponseGET,
  { id: number; data: Partial<RescheduleCommentRequestPOST> },
  { state: RootState }
>("rescheduleComments/updateRescheduleComment", async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await api.patch<RescheduleCommentResponseGET>(
      `/reschedule-comments/${id}/`,
      data,
    );
    return response.data;
  } catch (error: unknown) {
    return rejectWithValue(
      handleApiCommentError(error, "Ошибка при обновлении комментария о переносе"),
    );
  }
});

// Удаление комментария о переносе сроков
export const deleteRescheduleCommentRequest = createAsyncThunk<void, number, { state: RootState }>(
  "rescheduleComments/deleteRescheduleComment",
  async (commentId, { rejectWithValue }) => {
    try {
      await api.delete(`/reschedule-comments/${commentId}/`);
    } catch (error: unknown) {
      return rejectWithValue(
        handleApiCommentError(error, "Ошибка при удалении комментария о переносе"),
      );
    }
  },
);
