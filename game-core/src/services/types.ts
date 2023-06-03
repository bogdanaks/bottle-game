export interface SubsRoomJoinData {
  userId: string
  roomId: string
}

export interface RoomEventData {
  type: string
  userId: string
  roomId: string
  data: any
}
