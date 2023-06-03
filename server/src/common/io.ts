import { io } from "@/app"
import { SocketType } from "@/modules/chat/types"
import { UserService } from "@/modules/user"
import { RedisService } from "@/services/redis"
import { SocketService } from "@/services/socket"
import { SocketEvents } from "./socket-events"

interface IoConnectorProps {
  io: typeof io
  redisService: RedisService
  socketService: SocketService
  userService: UserService
}

export class IoConnector {
  public io
  public socketService
  public redisService
  public userService

  constructor({ io, userService, redisService, socketService }: IoConnectorProps) {
    this.io = io
    this.redisService = redisService
    this.userService = userService
    this.socketService = socketService
  }

  async connect() {
    await this.redisService.start()

    this.socketService.authSocket()
    await this.socketService.onRedisListeners()
    this.io.on(SocketEvents.Connection, async (socket) => {
      this.socketService.connection(socket as unknown as SocketType)
    })
    this.io.on(SocketEvents.ConnectionError, (err) =>
      console.log(`connect_error due to ${err.message}`)
    )
  }
}
