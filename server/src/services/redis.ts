import { JoinRoomPubProps } from "./types"
import { RedisAdapter } from "./redis-adapter"
import { UserService } from "@/modules/user"
import { RedisEvents } from "@/common/redis-events"
import { MessageEntity } from "@/modules/message"
import { SocketEvents } from "@/common/socket-events"
import { Payload } from "@/common/types"
import { Callback } from "ioredis"

interface RedisServiceProps {
  redisAdapter: RedisAdapter
  userService: UserService
}

interface PubMessageAddProps {
  roomId: string
  userId: string
  data: MessageEntity
}

export class RedisService {
  public redisAdapter
  public userService

  constructor({ redisAdapter, userService }: RedisServiceProps) {
    this.redisAdapter = redisAdapter
    this.userService = userService
  }

  async gameInitPub({ roomId, userId }: JoinRoomPubProps) {
    const data = { roomId, userId, type: RedisEvents.GameInit }
    await this.redisAdapter.pub(RedisEvents.GameInit, data)
  }

  async gameStartPub({ roomId, userId }: JoinRoomPubProps) {
    const data = { roomId, userId, type: RedisEvents.GameStart }
    await this.redisAdapter.pub(RedisEvents.GameStart, data)
  }

  async gameEndPub({ roomId, userId }: JoinRoomPubProps) {
    const data = { roomId, userId, type: RedisEvents.GameEnd }
    await this.redisAdapter.pub(RedisEvents.GameEnd, data)
  }

  async pubMessageAdd({ roomId, userId, data }: PubMessageAddProps) {
    const payload = { roomId, userId, type: RedisEvents.MessageAdd, data }
    await this.redisAdapter.pub(RedisEvents.MessageAdd, payload)
  }

  supRoom(roomId: string, cb: any) {
    this.redisAdapter.sub(`roomId:${roomId}`, cb)
  }

  public async onListeners(emitters: Partial<Record<SocketEvents, any>>) {
    this.supRoom("*", async (err: any, count: any) => {
      if (err) console.error(err.message)
      console.log(`Subscribed to ${count} channels.`)
    })

    this.redisAdapter.on("pmessage", async (pattern, channel, message) => {
      if (!message) {
        throw new Error("message undefined")
      }
      const data = JSON.parse(message) as Payload
      const fnEmit = emitters[data.type]

      if (fnEmit) {
        fnEmit(data)
      }
    })
  }
}
