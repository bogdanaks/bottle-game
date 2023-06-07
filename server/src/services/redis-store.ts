import { GameState, UserInRoom } from "@/common/types"
import { appConfig } from "@/config"
import { Redis } from "ioredis"
import { nanoid } from "nanoid"

export class RedisStore {
  public redisStore: Redis

  constructor() {
    this.redisStore = new Redis()
  }

  // public async addUserInRoom(roomId: string, userId: string) {
  //   const newList = await this.getUsersByRoomId(roomId)
  //   await this.redisStore.set(`rooms:${roomId}:users`, JSON.stringify([...newList, userId]))
  // }

  // public async delUserInRoom(roomId: string, userId: string) {
  //   const newList = await this.getUsersByRoomId(roomId)
  //   await this.redisStore.hset(
  //     `rooms:${roomId}:users`,
  //     newList.filter((i) => String(i) !== String(userId))
  //   )
  // }

  public async getMessagesByRoom(roomId: string) {
    const msgs = await this.redisStore.get(`rooms:${roomId}:messages`)
    return msgs ? JSON.parse(msgs) : []
  }

  public async delRoom() {}

  public async createRoom() {
    const roomList = await this.redisStore.get("rooms")
    const newRoomId = nanoid(6)
    let roomListParse = roomList ? (JSON.parse(roomList) as string[]) : []

    await this.redisStore.set("rooms", JSON.stringify([...roomListParse, newRoomId]))
    return newRoomId
  }

  public async getUserRoomId(userId: string): Promise<string | null> {
    return await this.redisStore.get(`userRoomId:${userId}`)
  }

  public async setUserRoom(roomId: string, userId: string): Promise<string | null> {
    return await this.redisStore.set(`userRoomId:${userId}`, roomId)
  }

  public async getUsersByRoomId(roomId: string): Promise<UserInRoom[]> {
    const users = await this.redisStore.get(`rooms:${roomId}:users`)
    return users ? JSON.parse(users) : []
  }

  public async addUserInRoom(roomId: string, userId: string, position: string) {
    const newList = await this.getUsersByRoomId(roomId)
    if (newList.length + 1 === appConfig.roomSize) {
      await this.delFreeRoom(roomId)
      await this.addBusyRoom(roomId)
    }
    await this.redisStore.set(
      `rooms:${roomId}:users`,
      JSON.stringify([...newList, { userId, position }])
    )
  }

  public async getRoomUsersWithoutUserId(roomId: string, userId: string): Promise<UserInRoom[]> {
    const playersStr = await this.redisStore.get(`rooms:${roomId}:users`)
    const players = playersStr ? (JSON.parse(playersStr) as UserInRoom[]) : []
    return players.filter((p) => String(p.userId) !== String(userId))
  }

  public async delUserFomRoom(roomId: string, userId: string) {
    const newList = await this.getUsersByRoomId(roomId)
    await this.redisStore.set(
      `rooms:${roomId}:users`,
      JSON.stringify(newList.filter((i) => String(i) !== String(userId)))
    )
  }

  public async getFreeRoom(): Promise<string | null> {
    const rooms = await this.redisStore.get("rooms:free")
    const roomsParse = rooms ? (JSON.parse(rooms) as string[]) : []
    return roomsParse.length ? roomsParse[0] : null
  }

  public async getFreeRooms(): Promise<string[]> {
    const rooms = await this.redisStore.get("rooms:free")
    return rooms ? JSON.parse(rooms) : []
  }

  public async addFreeRoom(roomId: string) {
    const rooms = await this.redisStore.get("rooms:free")
    const roomsParse = rooms ? JSON.parse(rooms) : []
    await this.redisStore.set("rooms:free", JSON.stringify([...roomsParse, roomId]))
  }

  public async delFreeRoom(roomId: string) {
    const rooms = await this.redisStore.get("rooms:free")
    const roomsParse = rooms ? (JSON.parse(rooms) as string[]) : []
    await this.redisStore.set(
      "rooms:free",
      JSON.stringify(roomsParse.filter((rId) => rId !== roomId))
    )
  }

  public async getBusyRooms(): Promise<string[]> {
    const rooms = await this.redisStore.get("rooms:busy")
    return rooms ? JSON.parse(rooms) : []
  }

  public async addBusyRoom(roomId: string) {
    const rooms = await this.redisStore.get("rooms:busy")
    const roomsParse = rooms ? JSON.parse(rooms) : []
    await this.redisStore.set("rooms:busy", JSON.stringify([...roomsParse, roomId]))
  }

  public async delBusyRoom(roomId: string) {
    const rooms = await this.redisStore.get("rooms:busy")
    const roomsParse = rooms ? (JSON.parse(rooms) as string[]) : []
    await this.redisStore.set(
      "rooms:busy",
      JSON.stringify(roomsParse.filter((rId) => rId !== roomId))
    )
  }

  public async getGameState(roomId: string): Promise<GameState | null> {
    const data = await this.redisStore.get(`gameState:${roomId}`)
    return data ? JSON.parse(data) : null
  }
}
