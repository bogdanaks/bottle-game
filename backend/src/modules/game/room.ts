import { RedisService } from "@/modules/redis/service"
import { nanoid } from "nanoid"
import { UserEntity, UserService } from "../user"
import { UserEntityWithPosition } from "@/common/types"

export class Room {
  private redisService
  private userService

  constructor({
    redisService,
    userService,
  }: {
    redisService: RedisService
    userService: UserService
  }) {
    this.redisService = redisService
    this.userService = userService
  }

  async getFree() {
    const freeRoom = await this.redisService.getFreeRoom()
    if (freeRoom) return freeRoom

    const newRoomId = nanoid(5)
    await this.redisService.addFreeRoom(newRoomId)
    return newRoomId
  }

  public async getUsersByRoomId(roomId: string): Promise<UserEntityWithPosition[]> {
    const usersStore = await this.redisService.getUsersByRoomId(roomId)
    const usersIds = usersStore.map((i) => i.userId)
    const userEntities = await this.userService.getUsersByIds(usersIds)

    return userEntities.map((uE) => {
      const user = usersStore.find((i) => String(i.userId) === String(uE.id))
      return { ...uE, position: user?.position || "1", hearts: user?.hearts || 0 }
    })
  }

  async userLeave(userId: string, roomId: string) {
    // TODO
  }
}
