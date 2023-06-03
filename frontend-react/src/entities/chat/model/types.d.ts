type SocketType = Socket<DefaultEventsMap, DefaultEventsMap>

interface ChatState {
  messages: ChatMessage[]
  users: UserEntity[]
  socketId: string | null
  roomId: string | null
  reply: ChatMessage | null
}

interface ChatMessage {
  id: number
  message: string
  room_id: string
  user: UserEntity
  user_id: string
  created_at: string
  updated_at: string
  reply_id: string | null
  reply: ChatMessage | null
}

interface NewChatMessage {
  message: string
  reply: ChatMessage | null
}
