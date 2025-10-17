import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchObservations,
  createObservationRequest,
  deleteObservationRequest,
  updateObservationRequest,
  restoreObservationRequest,
} from "@/api";
import { ObservationResponseGET, ObservationRequestPOST } from "@appTypes/types";

interface ObservationState {
  activeItems: ObservationResponseGET[];
  archivedItems: ObservationResponseGET[];
  itemsLoading: boolean;
  itemsError: string | null;
  createLoading: boolean;
  createError: string | null;
}

const initialState: ObservationState = {
  activeItems: [],
  archivedItems: [],
  itemsLoading: false,
  itemsError: null,
  createLoading: false,
  createError: null,
};

const observationsSlice = createSlice({
  name: "observations",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchObservations.pending, (state) => {
        state.itemsLoading = true;
        state.itemsError = null;
      })
      .addCase(
        fetchObservations.fulfilled,
        (
          state,
          action: PayloadAction<
            ObservationResponseGET[],
            string,
            { arg: { is_archived?: boolean } | void }
          >,
        ) => {
          if (action.meta.arg && "is_archived" in action.meta.arg) {
            if (action.meta.arg.is_archived) {
              state.archivedItems = action.payload;
            } else {
              state.activeItems = action.payload;
            }
          } else {
            state.activeItems = action.payload;
          }
          state.itemsLoading = false;
        },
      )
      .addCase(fetchObservations.rejected, (state, action) => {
        state.itemsError = (action.payload as string) || "Ошибка при загрузке данных";
        state.itemsLoading = false;
      })
      .addCase(createObservationRequest.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
      })
      .addCase(
        createObservationRequest.fulfilled,
        (state, action: PayloadAction<ObservationResponseGET>) => {
          state.activeItems = [...state.activeItems, { ...action.payload, is_archived: false }];
          state.createLoading = false;
        },
      )
      .addCase(createObservationRequest.rejected, (state, action) => {
        if (
          typeof action.payload === "string" &&
          action.payload.includes("Наблюдение с номером") &&
          action.payload.includes("уже существует")
        ) {
        } else {
          state.createError = (action.payload as string) || "Ошибка при создании наблюдения";
        }
        state.createLoading = false;
      })
      .addCase(
        deleteObservationRequest.fulfilled,
        (state, action: PayloadAction<void, string, { arg: number }>) => {
          state.activeItems = state.activeItems.filter(
            (item) => item.num_observation !== action.meta.arg,
          );
        },
      )
      .addCase(deleteObservationRequest.rejected, (state, action) => {
        state.itemsError = (action.payload as string) || "Ошибка при удалении наблюдения";
      })
      .addCase(
        updateObservationRequest.fulfilled,
        (
          state,
          action: PayloadAction<
            ObservationResponseGET,
            string,
            { arg: { num_observation: number; data: Partial<ObservationRequestPOST> } }
          >,
        ) => {
          const isArchived = action.meta.arg.data.is_archived ?? false;
          if (isArchived) {
            state.activeItems = state.activeItems.filter(
              (item) => item.num_observation !== action.payload.num_observation,
            );
            state.archivedItems = state.archivedItems.some(
              (item) => item.num_observation === action.payload.num_observation,
            )
              ? state.archivedItems.map((item) =>
                  item.num_observation === action.payload.num_observation
                    ? { ...action.payload, is_archived: true }
                    : item,
                )
              : [...state.archivedItems, { ...action.payload, is_archived: true }];
          } else {
            state.archivedItems = state.archivedItems.filter(
              (item) => item.num_observation !== action.payload.num_observation,
            );
            state.activeItems = state.activeItems.some(
              (item) => item.num_observation === action.payload.num_observation,
            )
              ? state.activeItems.map((item) =>
                  item.num_observation === action.payload.num_observation
                    ? { ...action.payload, is_archived: false }
                    : item,
                )
              : [...state.activeItems, { ...action.payload, is_archived: false }];
          }
          state.itemsLoading = false;
        },
      )
      .addCase(updateObservationRequest.rejected, (state, action) => {
        state.itemsError = (action.payload as string) || "Ошибка при обновлении наблюдения";
        state.itemsLoading = false;
      })
      .addCase(
        restoreObservationRequest.fulfilled,
        (state, action: PayloadAction<ObservationResponseGET>) => {
          state.archivedItems = state.archivedItems.filter(
            (item) => item.num_observation !== action.payload.num_observation,
          );
          state.activeItems = state.activeItems.some(
            (item) => item.num_observation === action.payload.num_observation,
          )
            ? state.activeItems.map((item) =>
                item.num_observation === action.payload.num_observation
                  ? { ...action.payload, is_archived: false }
                  : item,
              )
            : [...state.activeItems, { ...action.payload, is_archived: false }];
        },
      )
      .addCase(restoreObservationRequest.rejected, (state, action) => {
        state.itemsError = (action.payload as string) || "Ошибка при восстановлении наблюдения";
      });
  },
});

export default observationsSlice.reducer;
