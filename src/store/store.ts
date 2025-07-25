import { configureStore } from "@reduxjs/toolkit";
import numReducer from "./numSlice";

export const store = configureStore({
  reducer: {
    num: numReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
