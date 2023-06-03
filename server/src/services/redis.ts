import { JoinRoomPubProps } from "./types"
import { RedisAdapter } from "./redis-adapter"
import { UserService } from "@/modules/user"
import { RedisEvents } from "@/common/redis-events"
import { MessageEntity } from "@/modules/message"

interface RedisServiceProps {
  redisAdapter: RedisAdapter
  userService: UserService
}

interface PubMessageAddProps {
  roomId: string
  userId: string
  data: MessageEntity
}

interface EventData {
  roomId: string
  userId: string
  type: string
  data?: any
}

export class RedisService {
  public redisAdapter
  public userService

  constructor({ redisAdapter, userService }: RedisServiceProps) {
    this.redisAdapter = redisAdapter
    this.userService = userService
  }

  async start() {
    await this.redisAdapter.connect()
  }

  async gameStartPub({ roomId, userId }: JoinRoomPubProps) {
    const data = { roomId, userId, type: "start" }
    await this.redisAdapter.pub(RedisEvents.GameStart, data)
  }

  async gameEndPub({ roomId, userId }: JoinRoomPubProps) {
    const data = { roomId, userId, type: "end" }
    await this.redisAdapter.pub(RedisEvents.GameEnd, data)
  }

  async pubMessageAdd({ roomId, userId, data }: PubMessageAddProps) {
    const payload = { roomId, userId, type: "message:add", data }
    await this.redisAdapter.pub(RedisEvents.MessageAdd, payload)
  }

  supRoom(roomId: string, cb: (data: string) => void) {
    this.redisAdapter.sub(`roomId:${roomId}`, cb)
  }
}
