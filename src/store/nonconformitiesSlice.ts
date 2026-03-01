import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchNonconformities,
  createNonconformityRequest,
  deleteNonconformityRequest,
  updateNonconformityRequest,
  restoreNonconformityRequest,
} from "@/api";
import { NonconformityResponseGET, NonconformityRequestPOST } from "@appTypes/types";

interface NonconformitiesState {
  activeItems: NonconformityResponseGET[];
  archivedItems: NonconformityResponseGET[];
  itemsLoading: boolean;
  itemsError: string | null;
  createLoading: boolean;
  createError: string | null;
}

const initialState: NonconformitiesState = {
  activeItems: [],
  archivedItems: [],
  itemsLoading: false,
  itemsError: null,
  createLoading: false,
  createError: null,
};

const nonconformitiesSlice = createSlice({
  name: "nonconformities",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNonconformities.pending, (state) => {
        state.itemsLoading = true;
        state.itemsError = null;
      })
      .addCase(
        fetchNonconformities.fulfilled,
        (
          state,
          action: PayloadAction<
            NonconformityResponseGET[],
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
      .addCase(fetchNonconformities.rejected, (state, action) => {
        state.itemsError = (action.payload as string) || "Ошибка при загрузке данных";
        state.itemsLoading = false;
      })
      .addCase(createNonconformityRequest.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
      })
      .addCase(
        createNonconformityRequest.fulfilled,
        (state, action: PayloadAction<NonconformityResponseGET>) => {
          state.activeItems = [...state.activeItems, { ...action.payload, is_archived: false }];
          state.createLoading = false;
        },
      )
      .addCase(createNonconformityRequest.rejected, (state, action) => {
        if (
          typeof action.payload === "string" &&
          action.payload.includes("Несоответствие с номером") &&
          action.payload.includes("уже существует")
        ) {
        } else {
          state.createError = (action.payload as string) || "Ошибка при создании несоответствия";
        }
        state.createLoading = false;
      })
      .addCase(
        deleteNonconformityRequest.fulfilled,
        (state, action: PayloadAction<void, string, { arg: number }>) => {
          state.activeItems = state.activeItems.filter(
            (item) => item.num_nonconf !== action.meta.arg,
          );
        },
      )
      .addCase(deleteNonconformityRequest.rejected, (state, action) => {
        state.itemsError = (action.payload as string) || "Ошибка при удалении несоответствия";
      })
      .addCase(
        updateNonconformityRequest.fulfilled,
        (
          state,
          action: PayloadAction<
            NonconformityResponseGET,
            string,
            { arg: { num_nonconf: number; data: Partial<NonconformityRequestPOST> } }
          >,
        ) => {
          const isArchived = action.meta.arg.data.is_archived ?? false;
          if (isArchived) {
            state.activeItems = state.activeItems.filter(
              (item) => item.num_nonconf !== action.payload.num_nonconf,
            );
            state.archivedItems = state.archivedItems.some(
              (item) => item.num_nonconf === action.payload.num_nonconf,
            )
              ? state.archivedItems.map((item) =>
                  item.num_nonconf === action.payload.num_nonconf
                    ? { ...action.payload, is_archived: true }
                    : item,
                )
              : [...state.archivedItems, { ...action.payload, is_archived: true }];
          } else {
            state.archivedItems = state.archivedItems.filter(
              (item) => item.num_nonconf !== action.payload.num_nonconf,
            );
            state.activeItems = state.activeItems.some(
              (item) => item.num_nonconf === action.payload.num_nonconf,
            )
              ? state.activeItems.map((item) =>
                  item.num_nonconf === action.payload.num_nonconf
                    ? { ...action.payload, is_archived: false }
                    : item,
                )
              : [...state.activeItems, { ...action.payload, is_archived: false }];
          }
          state.itemsLoading = false;
        },
      )
      .addCase(updateNonconformityRequest.rejected, (state, action) => {
        state.itemsError = (action.payload as string) || "Ошибка при обновлении несоответствия";
        state.itemsLoading = false;
      })
      .addCase(
        restoreNonconformityRequest.fulfilled,
        (state, action: PayloadAction<NonconformityResponseGET>) => {
          state.archivedItems = state.archivedItems.filter(
            (item) => item.num_nonconf !== action.payload.num_nonconf,
          );
          state.activeItems = state.activeItems.some(
            (item) => item.num_nonconf === action.payload.num_nonconf,
          )
            ? state.activeItems.map((item) =>
                item.num_nonconf === action.payload.num_nonconf
                  ? { ...action.payload, is_archived: false }
                  : item,
              )
            : [...state.activeItems, { ...action.payload, is_archived: false }];
        },
      )
      .addCase(restoreNonconformityRequest.rejected, (state, action) => {
        state.itemsError = (action.payload as string) || "Ошибка при восстановлении несоответствия";
      });
  },
});

export default nonconformitiesSlice.reducer;
