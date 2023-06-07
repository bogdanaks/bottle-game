import { Not, MoreThan } from "typeorm"
import { RedisStore } from "../redis-store"
import { UserInRoom } from "@/common/types"
import { chooseNextPos } from "@/libs/get-next-position"

export class UserToRoomService {
  private redisStore
  constructor({ redisStore }: { redisStore: RedisStore }) {
    this.redisStore = redisStore
  }

  async getUsersByRoomId(roomId: string) {
    return await this.redisStore.getUsersByRoomId(roomId)
  }

  public async getRoomUsersWithoutUserId(roomId: string, userId: string): Promise<UserInRoom[]> {
    const users = await this.redisStore.getUsersByRoomId(roomId)
    return users.filter((u) => String(u.userId) !== String(userId))
  }

  async getUserPos(userId: string) {
    const userRoomId = await this.redisStore.getUserRoomId(userId)
    if (!userRoomId) {
      throw new Error("userRoomId undefined")
    }
    const users = await this.redisStore.getUsersByRoomId(userRoomId)
    const findUser = users.find((u) => u.userId === userId)

    return findUser ? findUser.position : "1"
  }

  async getNextPosUser(userId: string, roomId: string, prevPos: number) {
    const allUsers = await this.getRoomUsersWithoutUserId(roomId, userId)
    return chooseNextPos(allUsers, prevPos)
  }

  async getPlayerByPos(pos: number) {
    // const player = await this.userToRoomRepository.findOne({ where: { position: pos } })
    // return player ? player.position : 1
  }
}
