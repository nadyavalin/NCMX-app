import { configureStore } from "@reduxjs/toolkit";
import inconsistenciesReducer from "./inconsistenciesSlice";
import commentsReducer from "./commentsSlice";
import uiReducer from "./uiSlice";
import snackbarReducer from "./snackbarSlice";

export const store = configureStore({
  reducer: {
    inconsistencies: inconsistenciesReducer,
    comments: commentsReducer,
    ui: uiReducer,
    snackbar: snackbarReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
