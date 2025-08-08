import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@utils/api";
import { RootState } from "@store/store";
import { handleApiError } from "@utils/handleApiError";
import { APIResponse, ItemResponseGET, ItemRequestPOST } from "../../types/types";

// Thunk для загрузки списка несоответствий
export const fetchItems = createAsyncThunk<
  ItemResponseGET[],
  { is_archived?: boolean } | void,
  { state: RootState }
>("inconsistencies/fetchItems", async (params, { rejectWithValue }) => {
  try {
    const response = await api.get<APIResponse>("/ncmx-table/", {
      params: { is_archived: params?.is_archived },
    });
    return response.data.results || [];
  } catch (error: unknown) {
    return rejectWithValue(handleApiError(error, "Ошибка при получении списка несоответствий"));
  }
});

// Thunk для создания несоответствия
export const createInconsistencyRequest = createAsyncThunk<
  ItemResponseGET,
  ItemRequestPOST,
  { state: RootState }
>("inconsistencies/createInconsistency", async (formData, { rejectWithValue }) => {
  try {
    const response = await api.post<ItemResponseGET>("/ncmx-table/", formData);
    return response.data;
  } catch (error: unknown) {
    return rejectWithValue(
      handleApiError(error, "Ошибка при создании несоответствия", formData.num_nonconf),
    );
  }
});

// Thunk для удаления несоответствия
export const deleteInconsistencyRequest = createAsyncThunk<void, number, { state: RootState }>(
  "inconsistencies/deleteInconsistency",
  async (num_nonconf, { rejectWithValue }) => {
    try {
      await api.delete(`/ncmx-table/${num_nonconf}/`);
    } catch (error: unknown) {
      return rejectWithValue(handleApiError(error, "Ошибка при удалении несоответствия"));
    }
  },
);

// Thunk для восстановления несоответствия
export const restoreInconsistencyRequest = createAsyncThunk<
  ItemResponseGET,
  number,
  { state: RootState }
>("inconsistencies/restoreInconsistency", async (num_nonconf, { rejectWithValue }) => {
  try {
    const response = await api.post<ItemResponseGET>(`/ncmx-table/${num_nonconf}/restore/`);
    return response.data;
  } catch (error: unknown) {
    return rejectWithValue(handleApiError(error, "Ошибка при восстановлении несоответствия"));
  }
});

// Thunk для обновления несоответствия
export const updateInconsistencyRequest = createAsyncThunk<
  ItemResponseGET,
  { num_nonconf: number; data: Partial<ItemRequestPOST> },
  { state: RootState }
>("inconsistencies/updateInconsistency", async ({ num_nonconf, data }, { rejectWithValue }) => {
  try {
    const response = await api.patch<ItemResponseGET>(`/ncmx-table/${num_nonconf}/`, data);
    return response.data;
  } catch (error: unknown) {
    return rejectWithValue(handleApiError(error, "Ошибка при обновлении несоответствия"));
  }
});
