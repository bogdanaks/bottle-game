import { Repository } from "typeorm"
import { AppDataSource } from "@/common/data-source"
import { RoomEntity } from "./room.entity"
import { IoType } from "@/common/types"
import { RedisStore } from "@/services/redis-store"
import { getFreePosition } from "@/libs/get-free-position"
import { UserService } from "../user"

interface RoomServiceProps {
  io: IoType
  redisStore: RedisStore
  userService: UserService
}

export class RoomService {
  protected roomRepository
  protected io
  protected redisStore
  protected userService

  constructor({ io, redisStore, userService }: RoomServiceProps) {
    this.roomRepository = AppDataSource.getRepository<RoomEntity>(RoomEntity)
    this.io = io
    this.redisStore = redisStore
    this.userService = userService
  }

  async getNewRoom(userId: string) {
    let freeRoom = ""
    let isNew = false
    const beforeRoomId = await this.redisStore.getUserRoomId(String(userId))

    if (beforeRoomId) {
      freeRoom = beforeRoomId
    } else {
      freeRoom = await this.getFreeRoom()
      isNew = true
    }

    return {
      roomId: String(freeRoom),
      isNew,
    }
  }

  async getFreeRoom() {
    const freeRoom = await this.redisStore.getFreeRoom()
    if (freeRoom) return freeRoom

    const newRoomId = await this.createRoom()
    return newRoomId
  }

  async createRoom(): Promise<string> {
    const newRoomId = await this.redisStore.createRoom()
    return newRoomId
  }

  async getRoomPlayers(roomId: string) {
    const users = await this.redisStore.getUsersByRoomId(roomId)
    const usersEntities = await this.userService.getUsersByIds(users.map((u) => u.userId))
    const seedUsers = usersEntities.map((uE) => {
      const position = users.find((i) => String(i.userId) === String(uE.id))
      return { ...uE, position: position?.position }
    })
    return seedUsers
  }

  async joinToRoom(roomId: string, userId: string) {
    const users = await this.redisStore.getUsersByRoomId(roomId)
    const usersWithoutMe = users.filter((i) => String(i.userId) !== String(userId))

    const freePos = !usersWithoutMe.length ? 1 : getFreePosition(usersWithoutMe)
    if (!freePos) {
      throw new Error("Free pos is null")
    }

    await this.redisStore.addUserInRoom(roomId, userId, String(freePos))
    await this.redisStore.setUserRoom(roomId, userId)
    await this.redisStore.addFreeRoom(roomId)
  }

  async leaveRoom(userId: string) {
    const playerRoom = await this.redisStore.getUserRoomId(userId)
    if (!playerRoom) return
    console.log(`user ${userId} leave from ${playerRoom}`)
    await this.redisStore.delUserFomRoom(playerRoom, userId)
  }

  async getPlayerRoom(userId: string) {
    return await this.redisStore.getUserRoomId(userId)
  }
}
