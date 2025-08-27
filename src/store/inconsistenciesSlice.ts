import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchItems,
  createInconsistencyRequest,
  deleteInconsistencyRequest,
  updateInconsistencyRequest,
  restoreInconsistencyRequest,
} from "@/api";
import { ItemResponseGET, ItemRequestPOST } from "@appTypes/types";

interface InconsistenciesState {
  activeItems: ItemResponseGET[];
  archivedItems: ItemResponseGET[];
  itemsLoading: boolean;
  itemsError: string | null;
  createLoading: boolean;
  createError: string | null;
}

const initialState: InconsistenciesState = {
  activeItems: [],
  archivedItems: [],
  itemsLoading: false,
  itemsError: null,
  createLoading: false,
  createError: null,
};

const inconsistenciesSlice = createSlice({
  name: "inconsistencies",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchItems.pending, (state) => {
        state.itemsLoading = true;
        state.itemsError = null;
      })
      .addCase(
        fetchItems.fulfilled,
        (
          state,
          action: PayloadAction<
            ItemResponseGET[],
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
      .addCase(fetchItems.rejected, (state, action) => {
        state.itemsError = (action.payload as string) || "Ошибка при загрузке данных";
        state.itemsLoading = false;
      })
      .addCase(createInconsistencyRequest.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
      })
      .addCase(
        createInconsistencyRequest.fulfilled,
        (state, action: PayloadAction<ItemResponseGET>) => {
          state.activeItems = [...state.activeItems, { ...action.payload, is_archived: false }];
          state.createLoading = false;
        },
      )
      .addCase(createInconsistencyRequest.rejected, (state, action) => {
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
        deleteInconsistencyRequest.fulfilled,
        (state, action: PayloadAction<void, string, { arg: number }>) => {
          state.activeItems = state.activeItems.filter(
            (item) => item.num_nonconf !== action.meta.arg,
          );
        },
      )
      .addCase(deleteInconsistencyRequest.rejected, (state, action) => {
        state.itemsError = (action.payload as string) || "Ошибка при удалении несоответствия";
      })
      .addCase(
        updateInconsistencyRequest.fulfilled,
        (
          state,
          action: PayloadAction<
            ItemResponseGET,
            string,
            { arg: { num_nonconf: number; data: Partial<ItemRequestPOST> } }
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
      .addCase(updateInconsistencyRequest.rejected, (state, action) => {
        state.itemsError = (action.payload as string) || "Ошибка при обновлении несоответствия";
        state.itemsLoading = false;
      })
      .addCase(
        restoreInconsistencyRequest.fulfilled,
        (state, action: PayloadAction<ItemResponseGET>) => {
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
      .addCase(restoreInconsistencyRequest.rejected, (state, action) => {
        state.itemsError = (action.payload as string) || "Ошибка при восстановлении несоответствия";
      });
  },
});

export default inconsistenciesSlice.reducer;
