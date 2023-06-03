import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { RootState } from "app/store"

const initialState: { text: string } = {
  text: "",
}

export const consoleAlertSlice = createSlice({
  name: "consoleAlert",
  initialState,
  reducers: {
    setText: (state, action: PayloadAction<string>) => {
      state.text = action.payload
    },
  },
})

export const { setText } = consoleAlertSlice.actions

export const selectText = (state: RootState) => state.consoleAlert.text

export const consoleAlertReducer = consoleAlertSlice.reducer
