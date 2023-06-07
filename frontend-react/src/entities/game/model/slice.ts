import { PayloadAction, createSlice } from "@reduxjs/toolkit"

import { RootState } from "app/store"

const initialState: GameState = {
  game: null,
}

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setGameState: (state, actions: PayloadAction<GameData>) => {
      state.game = actions.payload
    },
  },
})

export const { setGameState } = gameSlice.actions

export const selectGame = (state: RootState) => state.game.game

export const gameReducer = gameSlice.reducer
