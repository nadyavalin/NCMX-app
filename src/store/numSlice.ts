import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ItemResponseGET } from "@components/types";
import { fetchItems, deleteInconsistencyRequest } from "@api/route";

interface InconsistencyNumberState {
  currentInconsistencyNumber: number | null;
  isModalCommentsOpen: boolean;
  isModalHistoryCommentsOpen: boolean;
  isModalEstimateResultOpen: boolean;
  items: ItemResponseGET[];
  itemsLoading: boolean;
  itemsError: string | null;
}

const initialState: InconsistencyNumberState = {
  currentInconsistencyNumber: null,
  isModalCommentsOpen: false,
  isModalHistoryCommentsOpen: false,
  isModalEstimateResultOpen: false,
  items: [],
  itemsLoading: false,
  itemsError: null,
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
      .addCase(
        deleteInconsistencyRequest.fulfilled,
        (state, action: PayloadAction<void, string, { arg: number }>) => {
          state.items = state.items.filter((item) => item.num_nonconf !== action.meta.arg);
        },
      )
      .addCase(deleteInconsistencyRequest.rejected, (state, action) => {
        state.itemsError = action.error.message || "Ошибка при удалении несоответствия";
      });
  },
});

export const {
  setCurrentInconsistencyNumber,
  toggleModalComments,
  toggleModalHistoryComments,
  toggleModalEstimateResult,
  addItemSuccess,
} = numSlice.actions;

export default numSlice.reducer;
