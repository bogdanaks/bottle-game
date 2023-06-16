import { createApi } from "@reduxjs/toolkit/dist/query/react"

import { baseQueryAuth } from "app/apiSlice"

import { SoketEvents } from "entities/chat/model/enums"
import { socket } from "entities/chat/model/socket"

export const gameApi = createApi({
  reducerPath: "gameApi",
  baseQuery: baseQueryAuth,
  endpoints: (builder) => ({
    spinBottle: builder.mutation<void, string>({
      queryFn: (jobId) => {
        return new Promise(() => {
          socket.emit(SoketEvents.SpinBottle, jobId)
        })
      },
    }),
    kissUser: builder.mutation<void, string>({
      queryFn: (userId) => {
        return new Promise(() => {
          socket.emit(SoketEvents.KissUser, userId)
        })
      },
    }),
  }),
})

export const { useSpinBottleMutation, useKissUserMutation } = gameApi
