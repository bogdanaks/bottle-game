import { io } from "@/app"
import { UserService } from "@/modules/user"
import { SocketEvents } from "../../common/socket-events"
import { SocketType } from "../../common/types"
import { SocketController } from "@/modules/socket"

interface IoConnectorProps {
  io: typeof io
  userService: UserService
  socketController: SocketController
}

export class IoConnector {
  public io
  public userService
  public socketController

  constructor({ io, userService, socketController }: IoConnectorProps) {
    this.io = io
    this.userService = userService
    this.socketController = socketController
  }

  async connect() {
    this.authIo()
    this.io.on(SocketEvents.Connection, async (socket) => {
      await this.socketController.connect(socket as unknown as SocketType)
    })
    this.io.on(SocketEvents.ConnectionError, (err) =>
      console.log(`connect_error due to ${err.message}`)
    )
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
