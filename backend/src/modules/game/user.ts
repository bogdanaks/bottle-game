import { getFreePosition } from "@/libs/get-free-position"
import { RedisService } from "@/modules/redis/service"

export class User {
  private redisService

  constructor({ redisService }: { redisService: RedisService }) {
    this.redisService = redisService
  }

  async getRoomId(userId: string) {
    return await this.redisService.getUserRoomId(userId)
  }

  async updateRoomId(userId: string, roomId: string) {
    return await this.redisService.setUserRoomId(userId, roomId)
  }

  async addUserInRoom(userId: string, roomId: string) {
    const users = await this.redisService.getUsersByRoomId(roomId)
    const usersWithoutMe = users.filter((i) => String(i.userId) !== String(userId))

    const freePos = !usersWithoutMe.length ? 1 : getFreePosition(usersWithoutMe)
    if (!freePos) {
      throw new Error("Free pos is null")
    }

    await this.redisService.addUserInRoom(roomId, userId, String(freePos))

    return freePos
  }
}
