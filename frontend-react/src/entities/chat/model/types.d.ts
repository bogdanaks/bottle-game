type SocketType = Socket<DefaultEventsMap, DefaultEventsMap>

interface ChatState {
  messages: ChatMessage[]
  users: UserEntity[]
  socketId: string | null
  roomId: string | null
  reply: ChatMessage | null
  isLoading: boolean
  userPoses: { [key: string]: UserPose }
  userDetails: UserEntity | null
}

interface InitState {
  lastHistory: HistoryEvent
  messages: ChatMessage[]
  users: UserEntity[]
  socketId: string
  roomId: string
}

interface ChatMessage {
  message: string
  user: UserEntity
  created_at: number
  reply_id: string | null
  reply: ChatMessage | null
}

interface NewChatMessage {
  message: string
  reply: ChatMessage | null
}

interface UserPose {
  x: string
  y: string
}
