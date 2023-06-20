import { GameInit, SocketType, UserEntityWithPosition } from "@/common/types"
import { SocketService } from "./service"
import { RedisService } from "../redis/service"
import { Game } from "@/modules/game/game"
import { SocketEvents } from "@/common/socket-events"
import { Room } from "../game/room"
import { appConfig } from "@/config"
import { ChatController } from "../chat"
import { UserEntity } from "../user"

interface SocketControllerProps {
  socketService: SocketService
  redisService: RedisService
  chatController: ChatController
  game: Game
  room: Room
}

export class SocketController {
  private socketService
  private game
  private room
  private chatController

  constructor({ socketService, room, game, chatController }: SocketControllerProps) {
    this.socketService = socketService
    this.room = room
    this.game = game
    this.chatController = chatController
  }

  async connect(socket: SocketType) {
    console.log(`[SocketController]: Socket(${socket.id}) connecting`)
    const { newRoomId: userRoomId, freePos } = await this.game.addUserInFreeRoom(
      String(socket.data.user.id)
    )
    console.log("userRoomId", userRoomId, "freePos", freePos)
    const userWithPos = { ...socket.data.user, position: String(freePos) } as UserEntityWithPosition
    console.log("userWithPos", userWithPos)
    await this.socketService.userJoin(socket, userRoomId, userWithPos)

    const users = await this.room.getUsersByRoomId(userRoomId)
    const gameStatus = await this.game.getGameStatus(userRoomId)

    if (users.length >= appConfig.roomSize && (!gameStatus || gameStatus === "waiting")) {
      await this.game.start(userRoomId)
    }

    await this.listeners(socket, userRoomId)
  }

  async listeners(socket: SocketType, roomId: string) {
    socket.on(
      SocketEvents.GameInit,
      async (resolve) => await this.onGameInit(resolve, roomId, socket.id)
    )
    socket.on(SocketEvents.RoomGet, (resolve) => this.onRoomGet(resolve, roomId))
    socket.on(SocketEvents.RoomUserLeave, (resolve) => this.onDisconnect(resolve, roomId))
    socket.on(SocketEvents.MessageGet, async (resolve) => await this.onMessagesGet(resolve, roomId))
    socket.on(SocketEvents.UsersGet, async (resolve) => await this.onUsersGet(resolve, roomId))
    socket.on(
      SocketEvents.MessageAdd,
      async (payload) => await this.onMessageAdd(socket, payload, roomId)
    )
    socket.on(
      SocketEvents.SpinBottle,
      async (jobId) => await this.onSpinBottle(socket.data.user, roomId, jobId)
    )
    socket.on(
      SocketEvents.KissUser,
      async (userTargetId) => await this.onKissUser(socket.data.user, roomId, userTargetId)
    )
    socket.on(
      SocketEvents.Disconnect,
      async () => await this.onDisconnect(String(socket.data.user.id), roomId)
    )
  }

  async onGameInit(resolve: (payload: GameInit) => void, roomId: string, socketId: string) {
    const messages = await this.chatController.getMessagesByRoom(roomId)
    const users = await this.room.getUsersByRoomId(roomId)
    const history = await this.game.getLastHistory(roomId)

    resolve({
      socketId,
      roomId,
      messages,
      users,
      lastHistory: history,
    })
  }

  async onRoomGet(resolve: any, roomId: string) {
    resolve(roomId)
  }

  async onMessagesGet(resolve: any, roomId: string) {
    // const msgs = await this.messageService.getMessagesByRoom(roomId)
    // resolve(msgs)
  }

  async onUsersGet(resolve: any, roomId: string) {
    // const users = await this.roomService.getRoomPlayers(roomId)
    //   resolve(users)
  }

  async onMessageAdd(socket: SocketType, newMessage: any, roomId: string) {
    const msg = { user: socket.data.user, ...newMessage }
    await this.chatController.addMessage(roomId, msg)
    await this.socketService.emitMessageAdd(msg, roomId)
    // const payload = { user: socket.data.user, ...newMessage }
    //   await this.redisService.pubMessageAdd({
    //     userId: String(socket.data.user.id),
    //     roomId: String(roomId),
    //     data: payload,
    //   })
  }

  async onSpinBottle(user: UserEntity, roomId: string, jobId: string) {
    await this.game.emitUserSpinBottle(roomId, user, jobId)
  }

  async onKissUser(user: UserEntity, roomId: string, userTargetId: string) {
    await this.game.emitKissUser(roomId, user, userTargetId)
  }

  async onDisconnect(userId: string, roomId: string) {
    await this.socketService.emitRoomLeave(userId, roomId)
    await this.room.userLeave(userId, roomId)
  }
}
