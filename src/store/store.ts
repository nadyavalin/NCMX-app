import { configureStore } from "@reduxjs/toolkit";
import nonconformitiesReducer from "./nonconformitiesSlice";
import observationsReducer from "./observationsSlice";
import improvementsReducer from "./improvementsSlice";
import commentsReducer from "./commentsSlice";
import rescheduleCommentsReducer from "./rescheduleCommentsSlice";
import uiReducer from "./uiSlice";
import snackbarReducer from "./snackbarSlice";

export const store = configureStore({
  reducer: {
    nonconformities: nonconformitiesReducer,
    observations: observationsReducer,
    improvements: improvementsReducer,
    comments: commentsReducer,
    rescheduleComments: rescheduleCommentsReducer,
    ui: uiReducer,
    snackbar: snackbarReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
