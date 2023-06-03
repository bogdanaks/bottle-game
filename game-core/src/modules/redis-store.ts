import { MessageEntity } from "@/common/entities"
import { createClient } from "redis"

export class RedisStore {
  public redisStore: ReturnType<typeof createClient>

  constructor() {
    this.redisStore = createClient()
  }

  public async start() {
    console.log("Redis Store: start")
    this.redisStore.on("ready", () => console.log("Redis: New client connected!"))
    this.redisStore.on("error", (err) => console.log("Redis: New client Error", err))
    await this.redisStore.connect()
  }

  public async addUserInRoom(roomId: string, userId: string) {
    const newList = await this.getUsersByRoomId(roomId)
    await this.redisStore.set(roomId, JSON.stringify([...newList, userId]))
  }

  public async delUserInRoom(roomId: string, userId: string) {
    const newList = await this.getUsersByRoomId(roomId)
    await this.redisStore.set(
      roomId,
      JSON.stringify(newList.filter((i) => String(i) !== String(userId)))
    )
  }

  public async getUsersByRoomId(roomId: string): Promise<string[]> {
    const users = await this.redisStore.get(roomId)
    return users ? JSON.parse(users) : []
  }

  public async addMessage(roomId: string, message: MessageEntity) {
    const msgs = await this.redisStore.get(roomId)
    const msgsParse = msgs ? JSON.parse(msgs) : []
    this.redisStore.set(roomId, JSON.stringify([...msgsParse, message]))
  }

  public async getMessagesByRoom(roomId: string) {
    const msgs = await this.redisStore.get(roomId)
    return msgs ? JSON.parse(msgs) : []
  }

  public async delRoom() {}

  public async getRoom() {}
}
