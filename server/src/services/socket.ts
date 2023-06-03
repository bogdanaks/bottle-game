import { IoType, SocketType } from "@/modules/chat/types"
import { RoomService } from "@/modules/room"
import { RedisService } from "./redis"
import { UserService } from "@/modules/user"
import { SocketEvents } from "@/common/socket-events"
import { ChatService } from "@/modules/chat"
import { NewMessage } from "@/common/types"

interface EventType {
  roomId: string
  userId: string
  type: string
  data?: any
}

interface SocketServiceProps {
  io: IoType
  userService: UserService
  roomService: RoomService
  chatService: ChatService
  redisService: RedisService
}

export class SocketService {
  public io
  public userService
  public roomService
  public chatService
  public redisService

  constructor({ roomService, io, redisService, userService, chatService }: SocketServiceProps) {
    this.io = io
    this.roomService = roomService
    this.userService = userService
    this.chatService = chatService
    this.redisService = redisService
  }

  async connection(socket: SocketType) {
    await this.onGameStart(socket)

    socket.on(SocketEvents.Disconnect, async () => {
      await this.disconnect(socket as unknown as SocketType)
    })
  }

  authSocket() {
    this.io.use(async (socketCon, next) => {
      const socket = socketCon as unknown as SocketType
      const userId = socket.handshake.auth.user_id
      const user = await this.userService.getUserById(String(userId))
      // const authToken = socket.handshake.auth.token as string
      // TODO check in database and validate tg user id and auth token
      if (userId && user) {
        socket.data.user = user
        next()
      } else {
        next(new Error("invalid socket auth"))
      }
    })
  }

  async disconnect(socket: SocketType) {
    console.log("User disconnected", socket.data.user.id)
    const userInRoom = await this.roomService.getPlayerRoom(socket.data.user.id)
    if (userInRoom) {
      await this.redisService.gameEndPub({
        userId: String(userInRoom.user_id),
        roomId: String(userInRoom.room_id),
      })
    }

    socket.disconnect(true)
  }

  public async onRedisListeners() {
    this.redisService.supRoom("*", async (data) => {
      console.log("tansportEmitter", data)
      await this.tansportEmitter(data)
    })
  }

  private async tansportEmitter(data: string) {
    const payload = JSON.parse(data) as EventType
    switch (payload.type) {
      case SocketEvents.RoomUserJoin:
        await this.emitRoomJoin(payload)
        break
      case SocketEvents.RoomUserLeave:
        await this.emitRoomLeave(payload)
        break
      case SocketEvents.MessageAdd:
        await this.emitMessageAdd(payload)
        break

      default:
        break
    }
  }

  public async emitRoomJoin(payload: EventType) {
    await this.roomService.joinToRoom(payload.roomId, payload.userId)
    const userInRoom = await this.roomService.getPlayerRoom(payload.userId)
    if (userInRoom) {
      this.io.to(payload.roomId).emit(SocketEvents.RoomUserJoin, userInRoom.user)
    }
  }

  public async emitRoomLeave(payload: EventType) {
    await this.roomService.leaveRoom(payload.userId)
    this.io.to(payload.roomId).emit(SocketEvents.RoomUserLeave, payload.userId)
  }

  public async emitMessageAdd(payload: EventType) {
    const message = payload.data as NewMessage
    const newMsg = await this.chatService.messageAdd({
      message,
      roomId: payload.roomId,
      userId: payload.userId,
    })

    if (newMsg) {
      this.io.to(payload.roomId).emit(SocketEvents.MessageUpdate, newMsg)
    }
  }

  public async onGameStart(socket: SocketType) {
    let freeRoom = ""
    const beforeRoom = await this.roomService.getPlayerRoom(String(socket.data.user.id))

    if (beforeRoom) {
      freeRoom = beforeRoom.room_id
    } else {
      freeRoom = await this.roomService.getFreeRoom()
    }

    console.log(`Socket(${socket.id}) connect to Room(${freeRoom})`)
    await socket.join(String(freeRoom))

    await this.redisService.gameStartPub({
      userId: String(socket.data.user.id),
      roomId: String(freeRoom),
    })

    await this.socketListeners(socket, String(freeRoom))
  }

  private async socketListeners(socket: SocketType, roomId: string) {
    socket.on(SocketEvents.MessageGet, async () => await this.chatService.messageGet(roomId))
    socket.on(SocketEvents.MessageAdd, async (newMessage) => {
      await this.redisService.pubMessageAdd({
        userId: String(socket.data.user.id),
        roomId: String(roomId),
        data: newMessage,
      })
    })

    socket.on(SocketEvents.UsersGet, async () => await this.chatService.usersGet(roomId))
  }
}
