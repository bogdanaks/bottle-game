import { SocketEvents } from "@/common/socket-events"
import { HistoryEvent, NewMessage, SocketType, UserEntityWithPosition } from "@/common/types"
import { io } from "@/app"
import { UserEntity } from "../user"

interface SocketServiceProps {
  io: typeof io
}

export class SocketService {
  private io

  constructor({ io }: SocketServiceProps) {
    this.io = io
  }

  async userJoin(socket: SocketType, roomId: string, user: UserEntityWithPosition) {
    await socket.join(roomId)
    await this.emitRoomJoin(user, roomId)
  }

  async emitRoomJoin(user: UserEntity, roomId: string) {
    this.io.to(roomId).emit(SocketEvents.RoomUserJoin, user)
  }

  async emitRoomLeave(userId: string, roomId: string) {
    this.io.to(roomId).emit(SocketEvents.RoomUserLeave, userId)
  }

  async emitMessageAdd(message: NewMessage, roomId: string) {
    this.io.to(roomId).emit(SocketEvents.MessageUpdate, message)
  }

  async emitHistoryPush(payload: HistoryEvent, roomId: string) {
    this.io.to(roomId).emit(SocketEvents.HistoryPush, payload)
  }
}
