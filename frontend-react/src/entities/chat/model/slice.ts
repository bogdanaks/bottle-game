import { PayloadAction, createSlice } from "@reduxjs/toolkit"

import { RootState } from "app/store"

const initialState: ChatState = {
  messages: [],
  users: [],
  socketId: null,
  roomId: null,
  reply: null,
  isLoading: true,
  userPoses: {},
  userDetails: null,
}

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setInit: (state, actions: PayloadAction<InitState>) => {
      state.messages = actions.payload.messages
      state.users = actions.payload.users
      state.roomId = actions.payload.roomId
      state.socketId = actions.payload.socketId
      state.isLoading = false
    },
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
    setUsers: (state, action: PayloadAction<UserEntity[]>) => {
      state.users = action.payload
    },
    joinUser: (state, action: PayloadAction<UserEntity>) => {
      state.users.push(action.payload)
    },
    leaveUser: (state, action: PayloadAction<string>) => {
      state.users = state.users.filter((i) => String(i.id) !== String(action.payload))
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setUserPoses: (state, action: PayloadAction<{ [key: string]: UserPose }>) => {
      state.userPoses = { ...state.userPoses, ...action.payload }
    },
    incrementUserHearts: (state, action: PayloadAction<string>) => {
      const newUsers = state.users.map((user) => {
        if (String(user.id) === action.payload) {
          return { ...user, hearts: user.hearts + 1 }
        }
        return user
      })
      state.users = newUsers
    },
    setUserDetails: (state, action: PayloadAction<UserEntity | null>) => {
      state.userDetails = action.payload
    },
  },
})

export const {
  setMessages,
  setSocketId,
  setRoomId,
  setReply,
  addMessage,
  joinUser,
  leaveUser,
  setUsers,
  setLoading,
  setInit,
  setUserPoses,
  incrementUserHearts,
  setUserDetails,
} = chatSlice.actions

export const selectChat = (state: RootState) => state.chat

export const chatReducer = chatSlice.reducer
