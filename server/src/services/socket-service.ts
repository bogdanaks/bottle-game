import { SocketEvents } from "@/common/socket-events"
import { GameState, IoType, NewMessage, Payload, SocketType } from "@/common/types"
import { RoomService } from "@/modules/room"
import { RedisStore } from "./redis-store"
import { MessageService } from "@/modules/message"
import { RedisService } from "./redis"
import { UserService } from "@/modules/user"

interface SocketServiceProps {
  io: IoType
  userService: UserService
  roomService: RoomService
  messageService: MessageService
  redisService: RedisService
  redisStore: RedisStore
}

export class SocketService {
  private io
  private roomService
  private userService
  private messageService
  private redisService
  private redisStore

  constructor({
    io,
    roomService,
    messageService,
    redisService,
    userService,
    redisStore,
  }: SocketServiceProps) {
    this.io = io
    this.roomService = roomService
    this.messageService = messageService
    this.redisService = redisService
    this.userService = userService
    this.redisStore = redisStore
  }

  async connect(socket: SocketType) {
    console.log(`SocketService: Socket(${socket.id}) connecting`)
    const roomId = await this.joinSocketToRoom(socket)
    this.listeners(socket, String(roomId))
  }

  listeners(socket: SocketType, roomId: string) {
    socket.on(SocketEvents.GameInit, async (resolve) => {
      const messages = await this.messageService.getMessagesByRoom(roomId)
      const users = await this.roomService.getRoomPlayers(roomId)
      const gameState = await this.redisStore.getGameState(roomId)

      resolve({
        socketId: socket.id,
        roomId,
        messages,
        users,
        gameState,
      })
    })

    socket.on(SocketEvents.RoomGet, (resolve) => resolve(roomId))
    socket.on(SocketEvents.MessageGet, async (resolve) => {
      const msgs = await this.messageService.getMessagesByRoom(roomId)
      resolve(msgs)
    })

    socket.on(SocketEvents.UsersGet, async (resolve) => {
      const users = await this.roomService.getRoomPlayers(roomId)
      resolve(users)
    })

    socket.on(SocketEvents.MessageAdd, async (newMessage) => {
      const payload = { user: socket.data.user, ...newMessage }
      await this.redisService.pubMessageAdd({
        userId: String(socket.data.user.id),
        roomId: String(roomId),
        data: payload,
      })
    })
  }

  private async joinSocketToRoom(socket: SocketType) {
    const userId = String(socket.data.user.id)
    console.log("userId", userId)
    const { roomId, isNew } = await this.roomService.getNewRoom(userId)

    if (isNew) {
      await this.roomService.joinToRoom(roomId, userId)
    }
    await socket.join(roomId)
    await this.redisService.gameStartPub({ roomId, userId })
    return roomId
  }

  public onRedisListeners() {
    this.redisService.onListeners({
      [SocketEvents.RoomUserJoin]: async (payload: Payload) => await this.emitRoomJoin(payload),
      [SocketEvents.RoomUserLeave]: async (payload: Payload) => await this.emitRoomLeave(payload),
      [SocketEvents.MessageAdd]: async (payload: Payload) => await this.emitMessageAdd(payload),
      [SocketEvents.GameTick]: async (payload: Payload) => await this.emitGameTick(payload),
    })
  }

  private async emitRoomJoin(payload: Payload) {
    await this.roomService.joinToRoom(String(payload.roomId), payload.userId)
    const userInRoom = await this.roomService.getPlayerRoom(payload.userId)
    if (userInRoom) {
      const user = await this.userService.getUserById(userInRoom)
      this.io.to(String(payload.roomId)).emit(SocketEvents.RoomUserJoin, user)
    }
  }

  private async emitRoomLeave(payload: Payload) {
    await this.roomService.leaveRoom(payload.userId)
    this.io.to(String(payload.roomId)).emit(SocketEvents.RoomUserLeave, payload.userId)
  }

  private async emitMessageAdd(payload: Payload) {
    const message = payload.data as NewMessage
    this.io.to(String(payload.roomId)).emit(SocketEvents.MessageUpdate, message)
  }

  private async emitGameTick(payload: Payload) {
    this.io.to(String(payload.roomId)).emit(SocketEvents.GameTick, payload)
  }
}
