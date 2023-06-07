import { RedisService } from "./modules/redis"
import { RedisEvents } from "./common/redis-events"
import { SocketEvents } from "./common/socket-events"
import { MessageEntity } from "./common/entities"
import { RedisStore } from "./modules/redis-store"
import { Action } from "./modules/action"
import { Payload } from "./common/types"
import { appConfig } from "./config"

interface MessageAddData {
  userId: string
  roomId: string
  data: MessageEntity
}

export class GameCore {
  private redisService
  private redisStore
  private action

  constructor({
    redisService,
    action,
    redisStore,
  }: {
    action: Action
    redisService: RedisService
    redisStore: RedisStore
  }) {
    this.redisService = redisService
    this.redisStore = redisStore
    this.action = action
  }

  public async run() {
    this.redisService.sub("roomId:*")

    this.redisService.on("pmessage", async (pattern: string, channel: string, message: string) => {
      console.log(`Received message from ${channel} channel with pattern ${pattern}`)
      const payload = JSON.parse(message) as Payload

      switch (payload.type) {
        case RedisEvents.GameStart:
          await this.gameStart(message)
          break
        case RedisEvents.GameEnd:
          await this.gameEnd(message)
          break
        case RedisEvents.MessageAdd:
          await this.messageAdd(message)
          break

        default:
          break
      }
    })
  }

  private async gameInit(data: string) {
    // const { roomId, userId } = JSON.parse(data) as SubsRoomJoinData
    // console.log(`RoomId(${roomId}), UserId(${userId})`)
    // // TODO before ussubscibe need check already client
    // const newClient: ClientRedis = await this.redisService.createDuplicate()
    // await this.initUser(userId, roomId)
    // // subscribe new client on room
    // this.redisService.subByClient(newClient, roomId, async (eventData) => {
    //   const eventDataParse = JSON.parse(eventData) as RoomEventData
    //   console.log("eventDataParse", eventDataParse)
    //   await this.transportEvents(eventDataParse)
    // })
  }

  private async gameStart(data: string) {
    const dataParse = JSON.parse(data) as Payload

    await this.action.runTick(`tick:${dataParse.roomId}`, dataParse, appConfig.gameTickMs)
  }

  private async gameEnd(data: string) {
    const { userId, roomId } = JSON.parse(data) as Payload
    await this.redisStore.delUserFomRoom(roomId, userId)
    // await this.redisService.pub(`roomId:${roomId}`, {
    //   roomId,
    //   userId,
    //   type: SocketEvents.RoomUserLeave,
    // })
  }

  private async initUser(userId: string, roomId: string) {
    await this.redisStore.addUserInRoom(roomId, userId, "1") // TODO position "1" maybe has bad idea
    await this.redisService.pub(`roomId:${roomId}`, {
      roomId,
      userId,
      type: SocketEvents.RoomUserJoin,
    })
  }

  private async messageAdd(data: string) {
    const { userId, roomId, data: msg } = JSON.parse(data) as MessageAddData

    const msgWithDate = { ...msg, created_at: Date.now() }
    await this.redisStore.addMessage(roomId, msgWithDate)
  }

  // private async transportEvents(eventData: RoomEventData) {
  //   switch (eventData.type) {
  //     case SocketEvents.RoomUserJoin:
  //       await this.roomJoinStore(eventData)
  //       break
  //     case SocketEvents.MessageAdd:
  //       await this.messageAddStore(eventData)
  //       break

  //     default:
  //       break
  //   }
  // }

  // private async roomJoinStore(eventData: RoomEventData) {
  //   console.log("Game: roomJoinStore") // SAVE TO RAM
  // }

  // private async messageAddStore(eventData: RoomEventData) {
  //   console.log("Game: messageAddStore") // SAVE TO RAM
  // }
}
