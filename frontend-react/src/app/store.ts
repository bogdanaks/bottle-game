import { Action, ThunkAction, combineReducers, configureStore } from "@reduxjs/toolkit"
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from "redux-persist"
import storage from "redux-persist/lib/storage"

import { authApi } from "entities/auth/api"
import { authReducer } from "entities/auth/model/slice"
import { chatReducer } from "entities/chat/model/slice"
import { consoleAlertReducer } from "entities/console-alert/model/slice"
import { chatApi } from "entities/chat/api"

const persistConfig = {
  key: "root",
  storage,
  whitelist: [],
}

const rootReducer = combineReducers({
  consoleAlert: consoleAlertReducer,
  chat: chatReducer,
  auth: authReducer,
  [authApi.reducerPath]: authApi.reducer,
  [chatApi.reducerPath]: chatApi.reducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
      .concat(authApi.middleware)
      .concat(chatApi.middleware),
  devTools: process.env.REACT_APP_ENVIRONMENT !== "production",
})

export const persistor = persistStore(store)

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
