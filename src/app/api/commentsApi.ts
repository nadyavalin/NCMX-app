import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@utils/api";
import { RootState } from "@store/store";
import { handleApiInconsistencyError } from "@utils/handleApiInconsistencyError";
import {
  APICommentsResponse,
  ItemCommentResponseGET,
  ItemCommentRequestPOST,
} from "@appTypes/types";

// Thunk для создания комментария
export const createCommentInconsistencyRequest = createAsyncThunk<
  ItemCommentResponseGET,
  ItemCommentRequestPOST,
  { state: RootState }
>("comments/createCommentInconsistency", async (formData, { rejectWithValue }) => {
  try {
    const response = await api.post<ItemCommentResponseGET>("/ncmx-comments/", formData);
    return response.data;
  } catch (error: unknown) {
    return rejectWithValue(handleApiInconsistencyError(error, "Ошибка при создании комментария"));
  }
});

// Thunk для обновления комментария
export const updateCommentInconsistencyRequest = createAsyncThunk<
  ItemCommentResponseGET,
  { id: number; data: ItemCommentRequestPOST },
  { state: RootState }
>("comments/updateCommentInconsistency", async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await api.patch<ItemCommentResponseGET>(`/ncmx-comments/${id}/`, data);
    return response.data;
  } catch (error: unknown) {
    return rejectWithValue(handleApiInconsistencyError(error, "Ошибка при обновлении комментария"));
  }
});

// Thunk для удаления комментария
export const deleteCommentInconsistencyRequest = createAsyncThunk<
  void,
  number,
  { state: RootState }
>("comments/deleteCommentInconsistency", async (commentId, { rejectWithValue }) => {
  try {
    await api.delete(`/ncmx-comments/${commentId}/`);
  } catch (error: unknown) {
    return rejectWithValue(handleApiInconsistencyError(error, "Ошибка при удалении комментария"));
  }
});

// Thunk для загрузки комментариев
export const fetchCommentsItems = createAsyncThunk<
  ItemCommentResponseGET[],
  number | null,
  { state: RootState }
>("comments/fetchCommentsItems", async (num_nonconf, { rejectWithValue }) => {
  if (num_nonconf === null) {
    return [];
  }
  try {
    const response = await api.get<APICommentsResponse>("/ncmx-comments/", {
      params: { num_nonconf },
    });
    return response.data.results || [];
  } catch (error: unknown) {
    return rejectWithValue(handleApiInconsistencyError(error, "Ошибка при получении комментариев"));
  }
});
