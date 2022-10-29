import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Track } from "../types";
import { RootState } from "./store";

interface TracksDataState {
  value: Track[];
  currentTrackOrder: number[];
  currentTrackId: number;
  isTrackPlaying: boolean;
  isQueryShowing: boolean;
}

const initialState: TracksDataState = {
  value: [],
  currentTrackOrder: [],
  currentTrackId: -1,
  isTrackPlaying: false,
  isQueryShowing: false,
};

export const tracksDataSlice = createSlice({
  name: "tracksData",
  initialState,
  reducers: {
    setTracksData: (state, action: PayloadAction<Track[]>) => {
      return {
        ...state,
        value: action.payload,
      };
    },
    setCurrentTrackId: (state, action: PayloadAction<number>) => {
      return {
        ...state,
        currentTrackId: action.payload,
        isTrackPlaying: true,
      };
    },
    increaseCurrentTrackId: (state) => {
      if (state.currentTrackId === state.value.length - 1) {
        return { ...state, currentTrackId: 0 };
      }
      return { ...state, currentTrackId: state.currentTrackId + 1 };
    },
    decreaseCurrentTrackId: (state) => {
      if (state.currentTrackId === 0) {
        return { ...state, currentTrackId: state.value.length - 1 };
      }
      return { ...state, currentTrackId: state.currentTrackId - 1 };
    },
    setCurrentTrackOrder: (state, action: PayloadAction<number[]>) => {
      return { ...state, currentTrackOrder: action.payload };
    },
    toggleQueryShowing: (state) => {
      return { ...state, isQueryShowing: !state.isQueryShowing };
    },
    toggleTrackPlaying: (state) => {
      return { ...state, isTrackPlaying: !state.isTrackPlaying };
    },
  },
});

export const {
  setTracksData,
  setCurrentTrackId,
  setCurrentTrackOrder,
  increaseCurrentTrackId,
  decreaseCurrentTrackId,
  toggleQueryShowing,
  toggleTrackPlaying,
} = tracksDataSlice.actions;

export const selectTracksData = (state: RootState) => state.tracksData.value;
export const selectCurrentTrackData = (state: RootState) =>
  state.tracksData.value[
    state.tracksData.currentTrackOrder[state.tracksData.currentTrackId]
  ];
export const selectCurrentTrackId = (state: RootState) =>
  state.tracksData.currentTrackOrder[state.tracksData.currentTrackId];
export const selectIsTrackPlaying = (state: RootState) =>
  state.tracksData.isTrackPlaying;
export const selectIsQueryShowing = (state: RootState) =>
  state.tracksData.isQueryShowing;
export const selectCurrentTrackOrder = (state: RootState) =>
  state.tracksData.currentTrackOrder;

export default tracksDataSlice.reducer;
