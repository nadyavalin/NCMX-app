import { configureStore } from "@reduxjs/toolkit";
import numReducer from "./numSlice";

const rootReducer = (state = { value: 0 }, action: { type: string }) => {
  switch (action.type) {
    case "INCREMENT":
      return { ...state, value: state.value + 1 };
    default:
      return state;
  }
};

export const store = configureStore({
  reducer: {
    rootReducer,
    num: numReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
