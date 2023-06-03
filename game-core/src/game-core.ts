import { createClient } from "redis"
import { RedisService } from "./modules/redis"
import { RedisEvents } from "./common/redis-events"
import { SocketEvents } from "./common/socket-events"
import { MessageEntity } from "./common/entities"
import { RedisStore } from "./modules/redis-store"

type ClientRedis = ReturnType<typeof createClient>
interface SubsRoomJoinData {
  userId: string
  roomId: string
}

interface RoomEventData {
  type: string
  userId: string
  roomId: string
  data?: any
}

interface MessageAddData {
  userId: string
  roomId: string
  data: MessageEntity
}

export class GameCore {
  public usersByRoom
  public clientsByRoom
  private redisService
  private redisStore
  private messagesInRoom

  constructor({
    redisService,
    redisStore,
  }: {
    redisService: RedisService
    redisStore: RedisStore
  }) {
    this.usersByRoom = new Map<string, string[]>()
    this.clientsByRoom = new Map<string, ClientRedis[]>()
    this.messagesInRoom = new Map<string, MessageEntity[]>()
    this.redisService = redisService
    this.redisStore = redisStore
  }

  public async run() {
    await this.redisService.start()
    this.redisService.sub(RedisEvents.GameStart, async (data) => await this.gameStart(data))
    this.redisService.sub(RedisEvents.GameEnd, async (data) => await this.gameEnd(data))
    this.redisService.sub(RedisEvents.MessageAdd, async (data) => await this.messageAdd(data))
  }

  private async gameStart(data: string) {
    const { roomId, userId } = JSON.parse(data) as SubsRoomJoinData
    console.log(`RoomId(${roomId}), UserId(${userId})`)

    // TODO before ussubscibe need check already client
    const newClient: ClientRedis = await this.redisService.createDuplicate()
    await this.initUser(userId, roomId)

    // subscribe new client on room
    this.redisService.subByClient(newClient, roomId, async (eventData) => {
      const eventDataParse = JSON.parse(eventData) as RoomEventData
      await this.transportEvents(eventDataParse)
    })
  }

  private async gameEnd(data: string) {
    const { userId, roomId } = JSON.parse(data) as SubsRoomJoinData
    await this.redisStore.delUserInRoom(userId, roomId)
    await this.redisService.pub(`roomId:${roomId}`, {
      roomId,
      userId,
      type: SocketEvents.RoomUserLeave,
    })
    // TODO delete client redis if exists
  }

  private async initUser(userId: string, roomId: string) {
    await this.redisStore.addUserInRoom(roomId, userId)
    await this.redisService.pub(`roomId:${roomId}`, {
      roomId,
      userId,
      type: SocketEvents.RoomUserJoin,
    })
  }

  private async messageAdd(data: string) {
    const { userId, roomId, data: msg } = JSON.parse(data) as MessageAddData

    const messages = await this.redisStore.getMessagesByRoom(roomId)
    // console.log("msgs", messages)

    await this.redisStore.addMessage(roomId, msg)
    await this.redisService.pub(`roomId:${roomId}`, {
      roomId,
      userId,
      data: msg,
      type: SocketEvents.MessageAdd,
    })
  }

  private async transportEvents(eventData: RoomEventData) {
    switch (eventData.type) {
      case SocketEvents.RoomUserJoin:
        await this.roomJoinStore(eventData)
        break
      case SocketEvents.MessageAdd:
        await this.messageAddStore(eventData)
        break

      default:
        break
    }
  }

  private async roomJoinStore(eventData: RoomEventData) {
    console.log("Game: roomJoinStore") // SAVE TO RAM
  }

  private async messageAddStore(eventData: RoomEventData) {
    console.log("Game: messageAddStore") // SAVE TO RAM
  }
}
