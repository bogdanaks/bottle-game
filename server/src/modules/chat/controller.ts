import { TgUser } from "@/common/types"
import { RoomService } from "../room"
import { IoType, SocketType } from "./types"
import { RedisService } from "@/services/redis"

interface ChatControllerProps {}

export class ChatController {
  constructor() {}

  async onConnection(socket: SocketType) {
    // await this.authSocket()
    // socket.disconnect()
    // let freeRoom = ""
    // const userId = socket.handshake.auth.user_id
    // const beforeRoom = await this.roomService.getPlayerRoom(String(userId))
    // if (beforeRoom) {
    //   freeRoom = beforeRoom.room_id
    // } else {
    //   freeRoom = await this.roomService.getFreeRoom()
    // }
    // await socket.join(String(freeRoom))
    // await this.redisService.gameStartPub({
    //   userId: String(userId),
    //   roomId: String(freeRoom),
    // })
    // socket.on("room:join", async () => await this.chatService.messageGet(freeRoom))
    // await this.redis.joinRoom({
    //   userId: String(userId),
    //   roomId: String(freeRoom),
    // })
    // await this.roomService.joinToRoom(socket, freeRoom, String(userId))
    // socket.on("users:get", async () => await this.chatService.usersGet(freeRoom))
    // socket.on("room:leave", async () => await this.roomService.leaveRoom(socket, String(userId)))
    // socket.on(
    //   "message:add",
    //   async (newMessage, callback) =>
    //     await this.chatService.messageAdd({ socket, newMessage, roomId: freeRoom, callback })
    // )
    // socket.on("message:get", async () => await this.chatService.messageGet(freeRoom))
  }
}
