import { MessageEntity } from "@/common/entities"
import { GameState, UserInRoom } from "@/common/types"
import { appConfig } from "@/config"
import { Redis } from "ioredis"

export class RedisStore {
  public redisStore: Redis

  constructor() {
    this.redisStore = new Redis()
  }

  public async getUserRoomId(userId: string): Promise<string | null> {
    return await this.redisStore.get(`userRoomId:${userId}`)
  }

  public async setUserRoomId(roomId: string, userId: string): Promise<string | null> {
    return await this.redisStore.set(`userRoomId:${userId}`, roomId)
  }

  public async getUsersByRoomId(roomId: string): Promise<UserInRoom[]> {
    const users = await this.redisStore.get(`rooms:${roomId}:users`)
    return users ? JSON.parse(users) : []
  }

  public async addUserInRoom(roomId: string, userId: string, position: string) {
    const newList = await this.getUsersByRoomId(roomId)
    await this.setUserRoomId(userId, userId)
    if (newList.length + 1 === appConfig.roomSize) {
      await this.delFreeRoom(roomId)
      await this.addBusyRoom(roomId)
    }
    await this.redisStore.set(
      `rooms:${roomId}:users`,
      JSON.stringify([...newList, { userId, position }])
    )
  }

  public async delUserFomRoom(roomId: string, userId: string) {
    const newList = await this.getUsersByRoomId(roomId)
    await this.redisStore.set(
      `rooms:${roomId}:users`,
      JSON.stringify(newList.filter((i) => String(i) !== String(userId)))
    )
  }

  public async addMessage(roomId: string, message: MessageEntity) {
    const msgs = await this.redisStore.get(`rooms:${roomId}:messages`)
    const msgsParse = msgs ? JSON.parse(msgs) : []
    this.redisStore.set(`rooms:${roomId}:messages`, JSON.stringify([...msgsParse, message]))
  }

  public async getMessagesByRoom(roomId: string) {
    const msgs = await this.redisStore.get(`rooms:${roomId}:messages`)
    return msgs ? JSON.parse(msgs) : []
  }

  public async getGameState(roomId: string): Promise<GameState | null> {
    const data = await this.redisStore.get(`gameState:${roomId}`)
    return data ? JSON.parse(data) : null
  }

  public async updateGameState(roomId: string, gameData: GameState) {
    await this.redisStore.set(`gameState:${roomId}`, JSON.stringify(gameData))
  }

  public async delRoom() {}

  public async getRoomById(roomId: string) {
    const data = await this.redisStore.get(`gameState:${roomId}`)
  }

  public async addFreeRoom(roomId: string) {
    const rooms = await this.redisStore.get("rooms:free")
    const roomsParse = rooms ? JSON.parse(rooms) : []
    await this.redisStore.set("rooms:free", JSON.stringify([...roomsParse, roomId]))
  }

  public async addBusyRoom(roomId: string) {
    const rooms = await this.redisStore.get("rooms:busy")
    const roomsParse = rooms ? JSON.parse(rooms) : []
    await this.redisStore.set("rooms:busy", JSON.stringify([...roomsParse, roomId]))
  }

  public async delFreeRoom(roomId: string) {
    const rooms = await this.redisStore.get("rooms:free")
    const roomsParse = rooms ? (JSON.parse(rooms) as string[]) : []
    await this.redisStore.set(
      "rooms:free",
      JSON.stringify(roomsParse.filter((rId) => rId !== roomId))
    )
  }
}
