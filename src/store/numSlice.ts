import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ItemResponseGET } from "@components/types";
import {
  fetchItems,
  createInconsistencyRequest,
  deleteInconsistencyRequest,
  updateInconsistencyRequest,
} from "@api/route";

interface InconsistencyNumberState {
  currentInconsistencyNumber: number | null;
  isModalCommentsOpen: boolean;
  isModalHistoryCommentsOpen: boolean;
  isModalEstimateResultOpen: boolean;
  isModalEditOpen: boolean;
  items: ItemResponseGET[];
  itemsLoading: boolean;
  itemsError: string | null;
  createLoading: boolean;
  createError: string | null;
  commentLoading: boolean;
  commentError: string | null;
}

const initialState: InconsistencyNumberState = {
  currentInconsistencyNumber: null,
  isModalCommentsOpen: false,
  isModalHistoryCommentsOpen: false,
  isModalEstimateResultOpen: false,
  isModalEditOpen: false,
  items: [],
  itemsLoading: false,
  itemsError: null,
  createLoading: false,
  createError: null,
  commentLoading: false,
  commentError: null,
};

const numSlice = createSlice({
  name: "num",
  initialState,
  reducers: {
    setCurrentInconsistencyNumber(state, action: PayloadAction<number | null>) {
      state.currentInconsistencyNumber = action.payload;
    },
    toggleModalComments(state, action: PayloadAction<boolean>) {
      state.isModalCommentsOpen = action.payload;
    },
    toggleModalHistoryComments(state, action: PayloadAction<boolean>) {
      state.isModalHistoryCommentsOpen = action.payload;
    },
    toggleModalEstimateResult(state, action: PayloadAction<boolean>) {
      state.isModalEstimateResultOpen = action.payload;
    },
    toggleModalEdit(state, action: PayloadAction<boolean>) {
      state.isModalEditOpen = action.payload;
    },
    addItemSuccess(state, action: PayloadAction<ItemResponseGET>) {
      state.items = [...state.items, action.payload];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchItems.pending, (state) => {
        state.itemsLoading = true;
        state.itemsError = null;
      })
      .addCase(fetchItems.fulfilled, (state, action: PayloadAction<ItemResponseGET[]>) => {
        state.items = action.payload;
        state.itemsLoading = false;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.itemsError = action.error.message || "Ошибка при загрузке данных";
        state.itemsLoading = false;
      })
      .addCase(createInconsistencyRequest.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
      })
      .addCase(
        createInconsistencyRequest.fulfilled,
        (state, action: PayloadAction<ItemResponseGET>) => {
          state.items = [...state.items, action.payload];
          state.createLoading = false;
        },
      )
      .addCase(createInconsistencyRequest.rejected, (state, action) => {
        state.createError = action.error.message || "Ошибка при создании несоответствия";
        state.createLoading = false;
      })
      .addCase(
        deleteInconsistencyRequest.fulfilled,
        (state, action: PayloadAction<void, string, { arg: number }>) => {
          state.items = state.items.filter((item) => item.num_nonconf !== action.meta.arg);
        },
      )
      .addCase(deleteInconsistencyRequest.rejected, (state, action) => {
        state.itemsError = action.error.message || "Ошибка при удалении несоответствия";
      })
      .addCase(
        updateInconsistencyRequest.fulfilled,
        (state, action: PayloadAction<ItemResponseGET>) => {
          state.items = state.items.map((item) =>
            item.num_nonconf === action.payload.num_nonconf ? action.payload : item,
          );
          state.itemsLoading = false;
        },
      )
      .addCase(updateInconsistencyRequest.rejected, (state, action) => {
        state.itemsError = action.error.message || "Ошибка при обновлении несоответствия";
        state.itemsLoading = false;
      });
  },
});

export const {
  setCurrentInconsistencyNumber,
  toggleModalComments,
  toggleModalHistoryComments,
  toggleModalEstimateResult,
  toggleModalEdit,
  addItemSuccess,
} = numSlice.actions;

export default numSlice.reducer;
