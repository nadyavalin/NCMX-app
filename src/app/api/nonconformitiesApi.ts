import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@utils/api";
import { RootState } from "@store/store";
import { handleApiNonconformityError } from "@utils/handleApiError";
import { APIResponse, NonconformityResponseGET, NonconformityRequestPOST } from "@appTypes/types";

// Thunk для загрузки списка несоответствий
export const fetchNonconformities = createAsyncThunk<
  NonconformityResponseGET[],
  { is_archived?: boolean } | void,
  { state: RootState }
>("nonconformities/fetchNonconformities", async (params, { rejectWithValue }) => {
  try {
    const response = await api.get<APIResponse>("/ncmx-table-nonconformities/", {
      params: { is_archived: params?.is_archived },
    });
    return response.data.results || [];
  } catch (error: unknown) {
    return rejectWithValue(
      handleApiNonconformityError(error, "Ошибка при получении списка несоответствий"),
    );
  }
});

// Thunk для создания несоответствия
export const createNonconformityRequest = createAsyncThunk<
  NonconformityResponseGET,
  NonconformityRequestPOST,
  { state: RootState }
>("nonconformities/createNonconformity", async (formData, { rejectWithValue }) => {
  try {
    const response = await api.post<NonconformityResponseGET>(
      "/ncmx-table-nonconformities/",
      formData,
    );
    return response.data;
  } catch (error: unknown) {
    return rejectWithValue(
      handleApiNonconformityError(
        error,
        "Ошибка при создании несоответствия",
        formData.num_nonconf,
      ),
    );
  }
});

// Thunk для удаления несоответствия
export const deleteNonconformityRequest = createAsyncThunk<void, number, { state: RootState }>(
  "nonconformities/deleteNonconformity",
  async (num_nonconf, { rejectWithValue }) => {
    try {
      await api.delete(`/ncmx-table-nonconformities/${num_nonconf}/`);
    } catch (error: unknown) {
      return rejectWithValue(
        handleApiNonconformityError(error, "Ошибка при удалении несоответствия"),
      );
    }
  },
);

// Thunk для восстановления несоответствия
export const restoreNonconformityRequest = createAsyncThunk<
  NonconformityResponseGET,
  number,
  { state: RootState }
>("nonconformities/restoreNonconformity", async (num_nonconf, { rejectWithValue }) => {
  try {
    const response = await api.post<NonconformityResponseGET>(
      `/ncmx-table-nonconformities/${num_nonconf}/restore/`,
    );
    return response.data;
  } catch (error: unknown) {
    return rejectWithValue(
      handleApiNonconformityError(error, "Ошибка при восстановлении несоответствия"),
    );
  }
});

// Thunk для обновления несоответствия
export const updateNonconformityRequest = createAsyncThunk<
  NonconformityResponseGET,
  { num_nonconf: number; data: Partial<NonconformityRequestPOST> },
  { state: RootState }
>("nonconformities/updateNonconformity", async ({ num_nonconf, data }, { rejectWithValue }) => {
  try {
    const response = await api.patch<NonconformityResponseGET>(
      `/ncmx-table-nonconformities/${num_nonconf}/`,
      data,
    );
    return response.data;
  } catch (error: unknown) {
    return rejectWithValue(
      handleApiNonconformityError(error, "Ошибка при обновлении несоответствия"),
    );
  }
});
