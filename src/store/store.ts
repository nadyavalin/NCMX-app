import { configureStore } from "@reduxjs/toolkit";
import numReducer from "./numSlice";
import { RootState } from "@components/types";

export const store = configureStore({
  reducer: {
    num: numReducer,
  },
});

export type { RootState };
