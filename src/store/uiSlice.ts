import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UIState {
  currentInconsistencyNumber: number | null;
  isModalCommentsOpen: boolean;
  isModalRescheduleCommentsOpen: boolean;
  isModalHistoryCommentsOpen: boolean;
  isModalEstimateResultOpen: boolean;
  isModalEditOpen: boolean;

  currentObservationNumber: number | null;
  isModalObservationCommentsOpen: boolean;
  isModalObservationHistoryCommentsOpen: boolean;
  isModalObservationEditOpen: boolean;
}

const initialState: UIState = {
  currentInconsistencyNumber: null,
  isModalCommentsOpen: false,
  isModalRescheduleCommentsOpen: false,
  isModalHistoryCommentsOpen: false,
  isModalEstimateResultOpen: false,
  isModalEditOpen: false,

  currentObservationNumber: null,
  isModalObservationCommentsOpen: false,
  isModalObservationHistoryCommentsOpen: false,
  isModalObservationEditOpen: false,
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
    toggleModalRescheduleComments: (state, action: PayloadAction<boolean>) => {
      state.isModalRescheduleCommentsOpen = action.payload;
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

    setCurrentObservationNumber(state, action: PayloadAction<number | null>) {
      state.currentObservationNumber = action.payload;
    },
    toggleModalObservationComments(state, action: PayloadAction<boolean>) {
      state.isModalObservationCommentsOpen = action.payload;
    },
    toggleModalObservationHistoryComments(state, action: PayloadAction<boolean>) {
      state.isModalObservationHistoryCommentsOpen = action.payload;
    },
    toggleModalObservationEdit(state, action: PayloadAction<boolean>) {
      state.isModalObservationEditOpen = action.payload;
    },
  },
});

export const {
  setCurrentInconsistencyNumber,
  toggleModalComments,
  toggleModalHistoryComments,
  toggleModalRescheduleComments,
  toggleModalEstimateResult,
  toggleModalEdit,

  setCurrentObservationNumber,
  toggleModalObservationComments,
  toggleModalObservationHistoryComments,
  toggleModalObservationEdit,
} = uiSlice.actions;

export default uiSlice.reducer;
