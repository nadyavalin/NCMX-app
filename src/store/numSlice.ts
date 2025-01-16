import { NumNonConfState } from "@components/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: NumNonConfState = {
  currentNum: null,
};

const numSlice = createSlice({
  name: "num",
  initialState,
  reducers: {
    setCurrentNumNonConf(state, action: PayloadAction<number | null>) {
      state.currentNum = action.payload;
    },
  },
});

export const { setCurrentNumNonConf } = numSlice.actions;
export default numSlice.reducer;
