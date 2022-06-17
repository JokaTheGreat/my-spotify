import { configureStore } from "@reduxjs/toolkit";
import tracksDataReducer from "./tracksDataSlice";

export const store = configureStore({
  reducer: {
    tracksData: tracksDataReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
