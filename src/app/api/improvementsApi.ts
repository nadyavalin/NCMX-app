import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@utils/api";
import { RootState } from "@store/store";
import { ImprovementRequestPOST, ImprovementResponseGET } from "@appTypes/types";
import { handleApiImprovementError } from "@utils/handleApiError";

interface ImprovementAPIResponse {
  results: ImprovementResponseGET[];
}

// Thunk для загрузки списка возможностей улучшения
export const fetchImprovements = createAsyncThunk<
  ImprovementResponseGET[],
  { is_archived?: boolean } | void,
  { state: RootState }
>("improvements/fetchImprovements", async (params, { rejectWithValue }) => {
  try {
    const response = await api.get<ImprovementAPIResponse>("/ncmx-table-improvements/", {
      params: { is_archived: params?.is_archived },
    });
    return response.data.results || [];
  } catch (error: unknown) {
    return rejectWithValue(
      handleApiImprovementError(error, "Ошибка при получении списка возможностей улучшения"),
    );
  }
});

// Thunk для создания возможности улучшения
export const createImprovementRequest = createAsyncThunk<
  ImprovementResponseGET,
  ImprovementRequestPOST,
  { state: RootState }
>("improvements/createImprovement", async (formData, { rejectWithValue }) => {
  try {
    const response = await api.post<ImprovementResponseGET>("/ncmx-table-improvements/", formData);
    return response.data;
  } catch (error: unknown) {
    return rejectWithValue(
      handleApiImprovementError(
        error,
        "Ошибка при создании возможности улучшения",
        formData.num_improvement,
      ),
    );
  }
});

// Thunk для удаления возможности улучшения
export const deleteImprovementRequest = createAsyncThunk<void, number, { state: RootState }>(
  "improvements/deleteImprovement",
  async (num_improvement, { rejectWithValue }) => {
    try {
      await api.delete(`/ncmx-table-improvements/${num_improvement}/`);
    } catch (error: unknown) {
      return rejectWithValue(
        handleApiImprovementError(error, "Ошибка при удалении возможности улучшения"),
      );
    }
  },
);

// Thunk для восстановления возможности улучшения
export const restoreImprovementRequest = createAsyncThunk<
  ImprovementResponseGET,
  number,
  { state: RootState }
>("improvements/restoreImprovement", async (num_improvement, { rejectWithValue }) => {
  try {
    const response = await api.post<ImprovementResponseGET>(
      `/ncmx-table-improvements/${num_improvement}/restore/`,
    );
    return response.data;
  } catch (error: unknown) {
    return rejectWithValue(
      handleApiImprovementError(error, "Ошибка при восстановлении возможности улучшения"),
    );
  }
});

// Thunk для обновления возможности улучшения
export const updateImprovementRequest = createAsyncThunk<
  ImprovementResponseGET,
  { num_improvement: number; data: Partial<ImprovementRequestPOST> },
  { state: RootState }
>("improvements/updateImprovement", async ({ num_improvement, data }, { rejectWithValue }) => {
  try {
    const response = await api.patch<ImprovementResponseGET>(
      `/ncmx-table-improvements/${num_improvement}/`,
      data,
    );
    return response.data;
  } catch (error: unknown) {
    return rejectWithValue(
      handleApiImprovementError(error, "Ошибка при обновлении возможности улучшения"),
    );
  }
});
