import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FiltersState } from "@appTypes/types";

interface UIState {
  currentNonconformityNumber: number | null;
  isModalCommentsOpen: boolean;
  isModalRescheduleCommentsOpen: boolean;
  isModalHistoryCommentsOpen: boolean;
  isModalEstimateResultOpen: boolean;
  isModalEditOpen: boolean;

  currentObservationNumber: number | null;
  isModalObservationCommentsOpen: boolean;
  isModalObservationHistoryCommentsOpen: boolean;
  isModalObservationEditOpen: boolean;

  currentImprovementNumber: number | null;
  isModalImprovementCommentsOpen: boolean;
  isModalImprovementEditOpen: boolean;

  filters: FiltersState;
}

const initialFilters: FiltersState = {
  search: "",
  isoRequirement: "",
  regulation: "",
  department: "",
  responsiblePerson: "",
};

const initialState: UIState = {
  currentNonconformityNumber: null,
  isModalCommentsOpen: false,
  isModalRescheduleCommentsOpen: false,
  isModalHistoryCommentsOpen: false,
  isModalEstimateResultOpen: false,
  isModalEditOpen: false,

  currentObservationNumber: null,
  isModalObservationCommentsOpen: false,
  isModalObservationHistoryCommentsOpen: false,
  isModalObservationEditOpen: false,

  currentImprovementNumber: null,
  isModalImprovementCommentsOpen: false,
  isModalImprovementEditOpen: false,

  filters: initialFilters,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setCurrentNonconformityNumber(state, action: PayloadAction<number | null>) {
      state.currentNonconformityNumber = action.payload;
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

    setCurrentImprovementNumber(state, action: PayloadAction<number | null>) {
      state.currentImprovementNumber = action.payload;
    },
    toggleModalImprovementComments(state, action: PayloadAction<boolean>) {
      state.isModalImprovementCommentsOpen = action.payload;
    },
    toggleModalImprovementEdit(state, action: PayloadAction<boolean>) {
      state.isModalImprovementEditOpen = action.payload;
    },

    setFilter(state, action: PayloadAction<{ key: keyof FiltersState; value: string }>) {
      state.filters[action.payload.key] = action.payload.value;
    },
    resetFilters(state) {
      state.filters = initialFilters;
    },
  },
});

export const {
  setCurrentNonconformityNumber,
  toggleModalComments,
  toggleModalHistoryComments,
  toggleModalRescheduleComments,
  toggleModalEstimateResult,
  toggleModalEdit,

  setCurrentObservationNumber,
  toggleModalObservationComments,
  toggleModalObservationHistoryComments,
  toggleModalObservationEdit,

  setCurrentImprovementNumber,
  toggleModalImprovementComments,
  toggleModalImprovementEdit,
  setFilter,
  resetFilters,
} = uiSlice.actions;

export default uiSlice.reducer;
