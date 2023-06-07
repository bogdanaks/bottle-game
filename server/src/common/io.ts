import { io } from "@/app"
import { UserService } from "@/modules/user"
import { RedisService } from "@/services/redis"
import { SocketEvents } from "./socket-events"
import { SocketType } from "./types"
import { SocketService } from "@/services/socket-service"
import { RedisStore } from "@/services/redis-store"

interface IoConnectorProps {
  io: typeof io
  redisStore: RedisStore
  redisService: RedisService
  socketService: SocketService
  userService: UserService
}

export class IoConnector {
  public io
  public socketService
  public redisService
  public redisStore
  public userService

  constructor({ io, userService, redisService, redisStore, socketService }: IoConnectorProps) {
    this.io = io
    this.redisStore = redisStore
    this.redisService = redisService
    this.userService = userService
    this.socketService = socketService
  }

  async connect() {
    this.authIo()
    this.io.on(SocketEvents.Connection, async (socket) => {
      await this.socketService.connect(socket as unknown as SocketType)
    })
    this.io.on(SocketEvents.ConnectionError, (err) =>
      console.log(`connect_error due to ${err.message}`)
    )
    this.socketService.onRedisListeners()
  }

  private authIo() {
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
}
