import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@utils/api";
import { RootState } from "@store/store";
import { handleApiObservationError } from "@utils/handleApiError";
import { ObservationResponseGET, ObservationRequestPOST } from "@appTypes/types";

interface ObservationAPIResponse {
  results: ObservationResponseGET[];
}

// Thunk для загрузки списка наблюдений
export const fetchObservations = createAsyncThunk<
  ObservationResponseGET[],
  { is_archived?: boolean } | void,
  { state: RootState }
>("observations/fetchObservations", async (params, { rejectWithValue }) => {
  try {
    const response = await api.get<ObservationAPIResponse>("/ncmx-table-observations/", {
      params: { is_archived: params?.is_archived },
    });
    return response.data.results || [];
  } catch (error: unknown) {
    return rejectWithValue(
      handleApiObservationError(error, "Ошибка при получении списка наблюдений"),
    );
  }
});

// Thunk для создания наблюдения
export const createObservationRequest = createAsyncThunk<
  ObservationResponseGET,
  ObservationRequestPOST,
  { state: RootState }
>("observations/createObservation", async (formData, { rejectWithValue }) => {
  try {
    const response = await api.post<ObservationResponseGET>("/ncmx-table-observations/", formData);
    return response.data;
  } catch (error: unknown) {
    return rejectWithValue(
      handleApiObservationError(error, "Ошибка при создании наблюдения", formData.num_observation),
    );
  }
});

// Thunk для удаления наблюдения
export const deleteObservationRequest = createAsyncThunk<void, number, { state: RootState }>(
  "observations/deleteObservation",
  async (num_observation, { rejectWithValue }) => {
    try {
      await api.delete(`/ncmx-table-observations/${num_observation}/`);
    } catch (error: unknown) {
      return rejectWithValue(handleApiObservationError(error, "Ошибка при удалении наблюдения"));
    }
  },
);

// Thunk для восстановления наблюдения
export const restoreObservationRequest = createAsyncThunk<
  ObservationResponseGET,
  number,
  { state: RootState }
>("observations/restoreObservation", async (num_observation, { rejectWithValue }) => {
  try {
    const response = await api.post<ObservationResponseGET>(
      `/ncmx-table-observations/${num_observation}/restore/`,
    );
    return response.data;
  } catch (error: unknown) {
    return rejectWithValue(
      handleApiObservationError(error, "Ошибка при восстановлении наблюдения"),
    );
  }
});

// Thunk для обновления наблюдения
export const updateObservationRequest = createAsyncThunk<
  ObservationResponseGET,
  { num_observation: number; data: Partial<ObservationRequestPOST> },
  { state: RootState }
>("observations/updateObservation", async ({ num_observation, data }, { rejectWithValue }) => {
  try {
    const response = await api.patch<ObservationResponseGET>(
      `/ncmx-table-observations/${num_observation}/`,
      data,
    );
    return response.data;
  } catch (error: unknown) {
    return rejectWithValue(handleApiObservationError(error, "Ошибка при обновлении наблюдения"));
  }
});
