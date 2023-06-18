import { RedisService } from "@/modules/redis/service"
import { nanoid } from "nanoid"
import { UserService } from "../user"
import { UserEntityWithPosition } from "@/common/types"
import { User } from "./user"

export class Room {
  private redisService
  private userService
  private user

  constructor({
    redisService,
    userService,
    user,
  }: {
    redisService: RedisService
    userService: UserService
    user: User
  }) {
    this.redisService = redisService
    this.userService = userService
    this.user = user
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
    await this.redisService.removeUserRoomId(userId)
    await this.redisService.removeUserInRoom(roomId, userId)
  }
}
