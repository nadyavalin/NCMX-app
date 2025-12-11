import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@utils/api";
import { RootState } from "@store/store";
import { RescheduleCommentRequestPOST, RescheduleCommentResponseGET } from "@appTypes/types";
import { handleApiCommentError } from "@utils/handleApiError";

export type RescheduleCommentContentType = "inconsistency" | "observation" | "improvement";

// Интерфейс для ответа API
interface APIRescheduleCommentsResponse {
  results: RescheduleCommentResponseGET[];
  count?: number;
  next?: string | null;
  previous?: string | null;
}

// Получение комментариев для несоответствия
export const fetchInconsistencyRescheduleComments = createAsyncThunk<
  RescheduleCommentResponseGET[],
  number | null,
  { state: RootState }
>(
  "rescheduleComments/fetchInconsistencyRescheduleComments",
  async (num_nonconf, { rejectWithValue }) => {
    if (num_nonconf === null) {
      return [];
    }
    try {
      const response = await api.get<APIRescheduleCommentsResponse>("/reschedule-comments/", {
        params: {
          content_type: "inconsistency",
          object_id: num_nonconf,
        },
      });
      return response.data.results || [];
    } catch (error: unknown) {
      return rejectWithValue(
        handleApiCommentError(
          error,
          "Ошибка при получении комментариев о переносе для несоответствия",
        ),
      );
    }
  },
);

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

// Вспомогательные функции для удобства
export const createInconsistencyRescheduleComment = (
  num_nonconf: number,
  data: Omit<RescheduleCommentRequestPOST, "content_type" | "object_id">,
) =>
  createRescheduleCommentRequest({
    ...data,
    content_type: "inconsistency",
    object_id: num_nonconf,
  });
