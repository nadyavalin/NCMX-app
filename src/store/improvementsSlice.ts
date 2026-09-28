import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchImprovements,
  createImprovementRequest,
  updateImprovementRequest,
  deleteImprovementRequest,
  restoreImprovementRequest,
} from "@/api/improvementsApi";
import { ImprovementResponseGET } from "@appTypes/types";

interface ImprovementsState {
  improvements: ImprovementResponseGET[];
  loading: boolean;
  error: string | null;
  createLoading: boolean;
  createError: string | null;
}

const initialState: ImprovementsState = {
  improvements: [],
  loading: false,
  error: null,
  createLoading: false,
  createError: null,
};

const improvementsSlice = createSlice({
  name: "improvements",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Загрузка списка
      .addCase(fetchImprovements.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchImprovements.fulfilled,
        (state, action: PayloadAction<ImprovementResponseGET[]>) => {
          state.improvements = action.payload;
          state.loading = false;
        },
      )
      .addCase(fetchImprovements.rejected, (state, action) => {
        state.error = (action.payload as string) || "Ошибка при загрузке возможностей улучшения";
        state.loading = false;
      })

      // Создание
      .addCase(createImprovementRequest.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
      })
      .addCase(
        createImprovementRequest.fulfilled,
        (state, action: PayloadAction<ImprovementResponseGET>) => {
          state.improvements = [...state.improvements, action.payload];
          state.createLoading = false;
        },
      )
      .addCase(createImprovementRequest.rejected, (state, action) => {
        state.createError =
          (action.payload as string) || "Ошибка при создании возможности улучшения";
        state.createLoading = false;
      })

      // Обновление
      .addCase(updateImprovementRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateImprovementRequest.fulfilled,
        (state, action: PayloadAction<ImprovementResponseGET>) => {
          state.improvements = state.improvements.map((improvement) =>
            improvement.num_improvement === action.payload.num_improvement
              ? action.payload
              : improvement,
          );
          state.loading = false;
        },
      )
      .addCase(updateImprovementRequest.rejected, (state, action) => {
        state.error = (action.payload as string) || "Ошибка при обновлении возможности улучшения";
        state.loading = false;
      })

      // Удаление
      .addCase(
        deleteImprovementRequest.fulfilled,
        (state, action: PayloadAction<void, string, { arg: number }>) => {
          state.improvements = state.improvements.filter(
            (improvement) => improvement.num_improvement !== action.meta.arg,
          );
        },
      )

      // Восстановление
      .addCase(
        restoreImprovementRequest.fulfilled,
        (state, action: PayloadAction<ImprovementResponseGET>) => {
          state.improvements = state.improvements.map((improvement) =>
            improvement.num_improvement === action.payload.num_improvement
              ? action.payload
              : improvement,
          );
        },
      );
  },
});

export default improvementsSlice.reducer;
