import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { RootState } from "app/store"

const initialState: ChatState = {
  messages: [],
  users: [],
  socketId: null,
  roomId: null,
  reply: null,
}

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setReply: (state, actions: PayloadAction<ChatMessage | null>) => {
      state.reply = actions.payload
    },
    setMessages: (state, actions: PayloadAction<ChatMessage[]>) => {
      state.messages = actions.payload
    },
    addMessage: (state, actions: PayloadAction<ChatMessage>) => {
      state.messages.push(actions.payload)
    },
    setRoomId: (state, actions: PayloadAction<string>) => {
      state.roomId = actions.payload
    },
    setSocketId: (state, actions: PayloadAction<string>) => {
      state.socketId = actions.payload
    },
    leaveRoom: (state) => {
      state.roomId = ""
    },
    setUsers: (state, action: PayloadAction<UserEntity[]>) => {
      state.users = action.payload
    },
    joinUser: (state, action: PayloadAction<UserEntity>) => {
      state.users.push(action.payload)
    },
    leaveUser: (state, action: PayloadAction<string>) => {
      state.users.filter((i) => String(i.id) !== String(action.payload))
    },
  },
})

export const {
  setMessages,
  setSocketId,
  setRoomId,
  leaveRoom,
  setReply,
  addMessage,
  joinUser,
  leaveUser,
  setUsers,
} = chatSlice.actions

export const selectChat = (state: RootState) => state.chat

export const chatReducer = chatSlice.reducer
