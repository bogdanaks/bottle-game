import { createApi } from "@reduxjs/toolkit/dist/query/react"
import { baseQueryAuth } from "app/apiSlice"
import { SoketEvents } from "../model/enums"
import { socket } from "../model/socket"

export const chatApi = createApi({
  reducerPath: "chatApi",
  baseQuery: baseQueryAuth,
  endpoints: (builder) => ({
    sendMessage: builder.mutation<ChatMessage, NewChatMessage>({
      queryFn: (newSendMessage) => {
        return new Promise((resolve) => {
          socket.emit(
            SoketEvents.MessageAdd,
            newSendMessage,
            (response: { message: ChatMessage }) => {
              resolve({ data: response.message })
            }
          )
        })
      },
    }),
  }),
})

export const { useSendMessageMutation } = chatApi
