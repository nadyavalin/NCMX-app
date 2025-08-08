import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SnackbarType } from "../types/types";

interface SnackbarItem {
  id: string;
  type: SnackbarType;
  text: string;
}

interface SnackbarState {
  snackbars: SnackbarItem[];
}

const initialState: SnackbarState = {
  snackbars: [],
};

const snackbarSlice = createSlice({
  name: "snackbar",
  initialState,
  reducers: {
    addSnackbar(state, action: PayloadAction<{ type: SnackbarType; text: string }>) {
      const id = Math.random().toString(36).substr(2, 9);
      state.snackbars = [{ id, type: action.payload.type, text: action.payload.text }];
    },
    removeSnackbar(state, action: PayloadAction<string>) {
      state.snackbars = state.snackbars.filter((snackbar) => snackbar.id !== action.payload);
    },
  },
});

export const { addSnackbar, removeSnackbar } = snackbarSlice.actions;
export default snackbarSlice.reducer;
