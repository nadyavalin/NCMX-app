import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IdState } from "@components/types";

const initialState: IdState = {
  currentID: null,
};

const idSlice = createSlice({
  name: "id",
  initialState,
  reducers: {
    setCurrentID(state, action: PayloadAction<number | null>) {
      state.currentID = action.payload;
    },
  },
});

export const { setCurrentID } = idSlice.actions;
export default idSlice.reducer;
