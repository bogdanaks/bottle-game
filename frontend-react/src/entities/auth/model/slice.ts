import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { RootState } from "app/store"

const initialState: AuthState = {
  isAuth: false,
}

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<boolean>) => {
      state.isAuth = action.payload
    },
  },
})

export const { setAuth } = authSlice.actions

export const authReducer = authSlice.reducer

export const selectIsAuth = (state: RootState) => state.auth.isAuth
