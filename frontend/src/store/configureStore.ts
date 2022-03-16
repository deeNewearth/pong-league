import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import matchesReducer from "../reducers/matches";
import playersReducer from "../reducers/players";

export const store = configureStore({
  reducer: {
    matches: matchesReducer,
    players: playersReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;