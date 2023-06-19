import { PayloadAction, createSlice } from "@reduxjs/toolkit"

import { RootState } from "app/store"

const initialState: GameState = {
  history: [],
}

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    pushHistory: (state, action: PayloadAction<HistoryEvent>) => {
      state.history.push(action.payload)
    },
  },
})

export const { pushHistory } = gameSlice.actions

export const selectHistory = (state: RootState) => state.game.history
export const selectLastHistory = (state: RootState): HistoryEvent | undefined =>
  state.game.history[state.game.history.length - 1]

export const gameReducer = gameSlice.reducer
