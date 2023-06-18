import { Redis } from "ioredis"

import { UserEntity } from "../user"
import { HistoryEvent, NewMessage, UserInRoom } from "@/common/types"
import { appConfig } from "@/config"

export class RedisService {
  protected pubClient
  protected subClient

  constructor() {
    this.pubClient = new Redis({
      port: appConfig.redisPort,
      host: appConfig.redisHost,
    })
    this.subClient = new Redis({
      port: appConfig.redisPort,
      host: appConfig.redisHost,
    })
  }

  // USERS
  async getUserById(userId: string) {
    return await this.subClient.get(`users:${userId}`)
  }

  async saveUser(user: UserEntity) {
    await this.pubClient.set(`users:${user.id}`, JSON.stringify(user), "EX", 3600)
  }

  async getUserRoomId(userId: string) {
    return await this.subClient.get(`users:${userId}:roomId`)
  }

  async setUserRoomId(userId: string, roomId: string) {
    return await this.pubClient.set(`users:${userId}:roomId`, roomId)
  }

  public async getUsersByRoomId(roomId: string): Promise<UserInRoom[]> {
    const users = await this.subClient.lrange(`rooms:${roomId}:users`, 0, 8)
    return users ? users.map((i) => JSON.parse(i)) : []
  }

  public async addUserInRoom(roomId: string, userId: string, position: string) {
    const newList = await this.getUsersByRoomId(roomId)
    if (newList.length + 1 === appConfig.roomSize) {
      await this.delFreeRoom(roomId)
    }

    await this.pubClient.rpush(
      `rooms:${roomId}:users`,
      JSON.stringify({ userId, position, hearts: 0 })
    )
  }

  public async incrementUserHearts(roomId: string, userId: string) {
    const userList = await this.getUsersByRoomId(roomId)
    const indexUser = userList.findIndex((i) => i.userId === userId)
    const findUser = userList[indexUser]

    if (!findUser) return

    await this.pubClient.lset(
      `rooms:${roomId}:users`,
      indexUser,
      JSON.stringify({ ...findUser, hearts: Number(findUser.hearts) + 1 })
    )
  }

  // ROOMS
  public async getFreeRoom(): Promise<string | null> {
    const rooms = await this.subClient.lrange("rooms:free", 0, 1)
    return rooms ? rooms[0] : null
  }

  public async addFreeRoom(roomId: string) {
    await this.pubClient.rpush("rooms:free", roomId)
  }

  public async delFreeRoom(roomId: string) {
    const rooms = await this.subClient.lrange("rooms:free", 0, -1)
    rooms.forEach(async (room, index) => {
      if (room === roomId) {
        await this.subClient.ltrim("rooms:free", index, index)
      }
    })
  }

  public async getGameStatus(roomId: string) {
    return await this.subClient.get(`rooms:${roomId}:status`)
  }

  public async updateGameStatus(roomId: string, gameState: string) {
    await this.subClient.set(`rooms:${roomId}:status`, gameState)
  }

  // MESSAGES
  public async getMessages(roomId: string): Promise<NewMessage[]> {
    const messages = await this.subClient.lrange(`rooms:${roomId}:messages`, 0, -1)
    return messages ? messages.map((i) => JSON.parse(i)) : []
  }

  public async addMessage(roomId: string, message: NewMessage) {
    await this.pubClient.rpush(`rooms:${roomId}:messages`, JSON.stringify(message))
  }

  // HISTORY
  public async getHistory(roomId: string): Promise<HistoryEvent[]> {
    const historyGet = await this.subClient.get(`rooms:${roomId}:history`)
    const historyParse = historyGet ? (JSON.parse(historyGet) as HistoryEvent[]) : []
    return historyParse
  }

  public async getLastHistory(roomId: string): Promise<HistoryEvent | null> {
    const history = await this.subClient.lrange(`rooms:${roomId}:history`, -1, -1)
    return history.length ? (JSON.parse(history[0]) as HistoryEvent) : null
  }

  public async pushHistory(roomId: string, event: HistoryEvent) {
    await this.pubClient.rpush(`rooms:${roomId}:history`, JSON.stringify(event))
  }
}
