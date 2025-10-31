import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@utils/api";
import { RootState } from "@store/store";
import {
  APICommentsResponse,
  ItemCommentResponseGET,
  ItemCommentRequestPOST,
} from "@appTypes/types";
import { handleApiCommentError } from "@utils/handleApiError";

export type CommentContentType = "inconsistency" | "observation" | "improvement";

// Универсальный Thunk для создания комментария
export const createCommentRequest = createAsyncThunk<
  ItemCommentResponseGET,
  ItemCommentRequestPOST,
  { state: RootState }
>("comments/createComment", async (formData, { rejectWithValue }) => {
  try {
    const response = await api.post<ItemCommentResponseGET>("/ncmx-comments/", formData);
    return response.data;
  } catch (error: unknown) {
    return rejectWithValue(handleApiCommentError(error, "Ошибка при создании комментария"));
  }
});

// Универсальный Thunk для обновления комментария
export const updateCommentRequest = createAsyncThunk<
  ItemCommentResponseGET,
  { id: number; data: Partial<ItemCommentRequestPOST> },
  { state: RootState }
>("comments/updateComment", async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await api.patch<ItemCommentResponseGET>(`/ncmx-comments/${id}/`, data);
    return response.data;
  } catch (error: unknown) {
    return rejectWithValue(handleApiCommentError(error, "Ошибка при обновлении комментария"));
  }
});

// Универсальный Thunk для удаления комментария
export const deleteCommentRequest = createAsyncThunk<void, number, { state: RootState }>(
  "comments/deleteComment",
  async (commentId, { rejectWithValue }) => {
    try {
      await api.delete(`/ncmx-comments/${commentId}/`);
    } catch (error: unknown) {
      return rejectWithValue(handleApiCommentError(error, "Ошибка при удалении комментария"));
    }
  },
);

// Универсальный Thunk для загрузки комментариев
export const fetchComments = createAsyncThunk<
  ItemCommentResponseGET[],
  { content_type: CommentContentType; object_id: number } | null,
  { state: RootState }
>("comments/fetchComments", async (params, { rejectWithValue }) => {
  if (params === null) {
    return [];
  }
  try {
    const response = await api.get<APICommentsResponse>("/ncmx-comments/", {
      params: {
        content_type: params.content_type,
        object_id: params.object_id,
      },
    });
    return response.data.results || [];
  } catch (error: unknown) {
    return rejectWithValue(handleApiCommentError(error, "Ошибка при получении комментариев"));
  }
});

// Вспомогательные функции для обратной совместимости
export const createInconsistencyComment = (
  num_nonconf: number,
  data: Omit<ItemCommentRequestPOST, "content_type" | "object_id">,
) =>
  createCommentRequest({
    ...data,
    content_type: "inconsistency",
    object_id: num_nonconf,
  });

export const createObservationComment = (
  num_observation: number,
  data: Omit<ItemCommentRequestPOST, "content_type" | "object_id">,
) =>
  createCommentRequest({
    ...data,
    content_type: "observation",
    object_id: num_observation,
  });

export const fetchInconsistencyComments = (num_nonconf: number) =>
  fetchComments({ content_type: "inconsistency", object_id: num_nonconf });

export const fetchObservationComments = (num_observation: number) =>
  fetchComments({ content_type: "observation", object_id: num_observation });

// Функции для работы со старыми параметрами (обратная совместимость)
export const fetchCommentsByNumNonconf = createAsyncThunk<
  ItemCommentResponseGET[],
  number | null,
  { state: RootState }
>("comments/fetchCommentsByNumNonconf", async (num_nonconf, { rejectWithValue }) => {
  if (num_nonconf === null) {
    return [];
  }
  try {
    const response = await api.get<APICommentsResponse>("/ncmx-comments/", {
      params: { num_nonconf },
    });
    return response.data.results || [];
  } catch (error: unknown) {
    return rejectWithValue(handleApiCommentError(error, "Ошибка при получении комментариев"));
  }
});

export const fetchCommentsByNumObservation = createAsyncThunk<
  ItemCommentResponseGET[],
  number | null,
  { state: RootState }
>("comments/fetchCommentsByNumObservation", async (num_observation, { rejectWithValue }) => {
  if (num_observation === null) {
    return [];
  }
  try {
    const response = await api.get<APICommentsResponse>("/ncmx-comments/", {
      params: { num_observation },
    });
    return response.data.results || [];
  } catch (error: unknown) {
    return rejectWithValue(handleApiCommentError(error, "Ошибка при получении комментариев"));
  }
});
