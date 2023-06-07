interface GameState {
  game: GameData | null
}

interface GamePayload {
  roomId: string
  userId: string
  type: string
  data: GameData
}

interface GameData {
  tick_time: number
  user_from: string
  user_to: string
  position_to: string
  position_from: string
}
