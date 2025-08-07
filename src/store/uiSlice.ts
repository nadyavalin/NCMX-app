import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UIState {
  currentInconsistencyNumber: number | null;
  isModalCommentsOpen: boolean;
  isModalHistoryCommentsOpen: boolean;
  isModalEstimateResultOpen: boolean;
  isModalEditOpen: boolean;
}

const initialState: UIState = {
  currentInconsistencyNumber: null,
  isModalCommentsOpen: false,
  isModalHistoryCommentsOpen: false,
  isModalEstimateResultOpen: false,
  isModalEditOpen: false,
};

const uiSlice = createSlice({
  name: "ui",
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
  },
});

export const {
  setCurrentInconsistencyNumber,
  toggleModalComments,
  toggleModalHistoryComments,
  toggleModalEstimateResult,
  toggleModalEdit,
} = uiSlice.actions;

export default uiSlice.reducer;
