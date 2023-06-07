export interface Payload {
  type: string
  userId: string
  roomId: string
  data?: any
}

export interface GameState {
  tick_time: number
  user_from: string
  user_to: string | null
  position_from: string
  position_to: string | null
}

export interface UserInRoom {
  userId: string
  position: string
}
