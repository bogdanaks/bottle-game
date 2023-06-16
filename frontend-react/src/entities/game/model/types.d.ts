interface GameState {
  history: HistoryEvent[]
}

interface GamePayload {
  roomId: string
  userId: string
  type: string
  data: GameData
}

interface GameData {
  tick_time: string
  user_target: string
  user_cur: string
  user_next: string
  position_target: string
  position_cur: string
  position_next: string
  status: "waiting" | "playing"
}

interface GameLocalState {
  isRunKissTime: boolean
}

interface HistoryEvent {
  event: HistoryEvents
  timestamp: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any
}

type HistoryEvents =
  | "gameStart"
  | "waitingSpin"
  | "userSpinBottle"
  | "confirmationTime"
  | "kissUser"
