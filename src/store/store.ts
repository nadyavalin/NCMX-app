import { configureStore } from "@reduxjs/toolkit";
import numReducer from "./numSlice";
import inconsistenciesReducer from "./inconsistenciesSlice";
import commentsReducer from "./commentsSlice";
import uiReducer from "./uiSlice";

export const store = configureStore({
  reducer: {
    num: numReducer,
    inconsistencies: inconsistenciesReducer,
    comments: commentsReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
