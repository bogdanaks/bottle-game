export interface JoinRoomPubProps {
  roomId: string
  userId: string
}

export interface JoinRoomSubProps {
  roomId: string
  cb: () => void
}
