import { configureStore } from "@reduxjs/toolkit";
import idReducer from "./idSlice";
import { RootState } from "@components/types";

export const store = configureStore({
  reducer: {
    id: idReducer,
  },
});

export type { RootState };
