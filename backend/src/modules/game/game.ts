import { RedisService } from "../redis/service"
import { Room } from "./room"
import { User } from "./user"
import { SocketService } from "../socket/service"
import { Redis } from "ioredis"
import { UserEntityWithPosition } from "@/common/types"
import { UserEntity } from "../user"
import { Task } from "./task"
import { chooseNextPos } from "@/libs/get-next-position"
import { appConfig } from "@/config"

interface GameProps {
  room: Room
  user: User
  redisService: RedisService
  socketService: SocketService
}

export class Game {
  private room
  private user
  private redisService
  private socketService
  private ioredis
  private taskManager

  constructor({ room, user, redisService, socketService }: GameProps) {
    this.ioredis = new Redis({
      port: appConfig.redisPort,
      host: appConfig.redisHost,
    })
    this.room = room
    this.user = user
    this.redisService = redisService
    this.socketService = socketService
    this.taskManager = new Task()
  }

  async addUserInFreeRoom(userId: string): Promise<{ newRoomId: string; freePos: number }> {
    const newRoomId = await this.room.getFree()
    await this.user.updateRoomId(userId, newRoomId)
    const freePos = await this.user.addUserInRoom(userId, newRoomId)
    return { newRoomId, freePos }
  }

  async getGameStatus(roomId: string) {
    return await this.redisService.getGameStatus(roomId)
  }

  protected async setGameStatus(roomId: string, status: string) {
    return await this.redisService.updateGameStatus(roomId, status)
  }

  async getLastHistory(roomId: string) {
    const historyRange = await this.redisService.getLastHistory(roomId)
    if (!historyRange) return null
    return historyRange
  }

  async start(roomId: string) {
    await this.setGameStatus(roomId, "starting")
    console.log("creating task")
    await this.startGame(roomId)
  }

  private async startGame(roomId: string) {
    console.log("startGame", roomId)
    const users = await this.room.getUsersByRoomId(roomId)
    const usersSorted = users.sort((a, b) => Number(a.position) - Number(b.position))

    await this.socketService.emitHistoryPush(
      {
        event: `gameStart`,
        timestamp: String(Date.now()),
      },
      roomId
    )
    await this.setWaitingSpin(roomId, usersSorted[0])
  }

  async setWaitingSpin(roomId: string, user: UserEntityWithPosition) {
    const job = await this.taskManager.createTask(
      5,
      async () => await this.userSpinBottle(roomId, user)
    )
    const event = {
      event: `waitingSpin`,
      timestamp: String(Date.now()),
      payload: {
        user,
        jobId: job.id,
      },
    }

    await this.redisService.pushHistory(roomId, event)
    await this.socketService.emitHistoryPush(event, roomId)
  }

  async emitUserSpinBottle(roomId: string, user: UserEntity, jobId: string) {
    await this.taskManager.cancelTask(jobId)
    const userWithPos = await this.room.getUsersByRoomId(roomId)
    const userMe = userWithPos.find((i) => String(i.id) === String(user.id))
    if (!userMe) throw new Error("userMe undefined")
    await this.userSpinBottle(roomId, userMe)
  }

  private async userSpinBottle(roomId: string, user: UserEntity) {
    const allUsers = await this.room.getUsersByRoomId(roomId)
    const usersWithoutMe = allUsers.filter((i) => String(i.id) !== String(user.id))
    const randomUser = usersWithoutMe[Math.floor(Math.random() * usersWithoutMe.length)]

    const event = {
      event: `userSpinBottle`,
      timestamp: String(Date.now()),
      payload: {
        user_current: user,
        user_target: randomUser,
      },
    }

    await this.redisService.pushHistory(roomId, event)
    await this.socketService.emitHistoryPush(event, roomId)

    await this.taskManager.createTask(3, async () => {
      await this.confirmationTime(roomId, user, randomUser)
    })
  }

  private async confirmationTime(roomId: string, user: UserEntity, targetUser: UserEntity) {
    const allUsers = await this.room.getUsersByRoomId(roomId)
    const usersMe = allUsers.find((i) => String(i.id) === String(user.id))
    if (!usersMe) throw new Error("usersMe undefined")
    const userNext = chooseNextPos(allUsers, Number(usersMe.position))

    const event = {
      event: `confirmationTime`,
      timestamp: String(Date.now()),
      payload: {
        user_current: user,
        user_target: targetUser,
      },
    }

    await this.redisService.pushHistory(roomId, event)
    await this.socketService.emitHistoryPush(event, roomId)

    await this.taskManager.createTask(10, async () => {
      await this.setWaitingSpin(roomId, userNext)
    })
  }

  public async emitKissUser(roomId: string, user: UserEntity, userTargetId: string) {
    await this.kissUser(roomId, user, userTargetId)
  }

  private async kissUser(roomId: string, user: UserEntity, userTargetId: string) {
    const event = {
      event: `kissUser`,
      timestamp: String(Date.now()),
      payload: {
        user_current: user.id,
        user_target: userTargetId,
      },
    }

    await this.redisService.incrementUserHearts(roomId, userTargetId)
    await this.socketService.emitHistoryPush(event, roomId)
  }
}
