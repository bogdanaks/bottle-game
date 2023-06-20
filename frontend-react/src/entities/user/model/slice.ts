import { PayloadAction, createSlice } from "@reduxjs/toolkit"

import { RootState } from "app/store"

const initialState: UserState = {
  appSettings: {
    hasVibration: true,
  },
}

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setAppSettings: (state, action: PayloadAction<AppSettingsLS>) => {
      state.appSettings = action.payload
    },
  },
})

export const { setAppSettings } = userSlice.actions

export const selectAppSettings = (state: RootState) => state.user.appSettings

export const userReducer = userSlice.reducer
