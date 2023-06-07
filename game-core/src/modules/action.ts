import { Worker, Queue, Job } from "bullmq"
import { Redis } from "ioredis"
import { RedisService } from "./redis"
import { RedisEvents } from "@/common/redis-events"
import { GameState, Payload } from "@/common/types"
import { UserToRoomService } from "./user-to-room/user-to-room.service"
import { RedisStore } from "./redis-store"

interface ActionProps {
  redisService: RedisService
  userToRoomService: UserToRoomService
  redisStore: RedisStore
}

export class Action {
  private queue
  private worker
  private redisService
  private redisStore
  private userToRoomService

  constructor({ redisService, userToRoomService, redisStore }: ActionProps) {
    this.redisService = redisService
    this.userToRoomService = userToRoomService
    this.redisStore = redisStore

    const ioredis = new Redis()
    this.queue = new Queue("game", { connection: ioredis })
    this.queue.obliterate()
    this.worker = new Worker(
      "game",
      async (job: Job) => {
        await this.updateRoomState(job.data)
      },
      { connection: ioredis }
    )
    this.onListeners()
  }

  async runTick(name: string, context?: Record<string, any>, repeat = 4000) {
    await this.queue.add(name, context, { repeat: { every: repeat } })
  }

  async updateRoomState(payload: Payload) {
    // TODO почти сделал, но не работает как надо, иногда сам на себя показывает
    const prevState = await this.redisStore.getGameState(payload.roomId)

    const users = await this.redisStore.getUsersByRoomId(payload.roomId)
    const userIdFrom = prevState ? prevState.user_from : payload.userId
    const findMe = users.find((i) => String(i.userId) === userIdFrom)
    if (!findMe || !userIdFrom) {
      throw new Error("findMe || userIdFrom undefined")
    }

    const findNextUser = await this.userToRoomService.getNextPosUser(
      userIdFrom,
      payload.roomId,
      Number(findMe.position)
    )

    if (!findNextUser) {
      throw new Error("findNextUser undefined")
    }

    console.log("findMe", findMe)
    const allUsers = await this.userToRoomService.getRoomUsersWithoutUserId(
      payload.roomId,
      findMe.userId
    )
    console.log("allUsers", allUsers)
    console.log("findNextUser", findNextUser)
    const status = !allUsers.length ? "waiting" : "playing"
    const randomUser =
      status === "playing" ? allUsers[Math.floor(Math.random() * allUsers.length)] : null

    const gameData = {
      tick_time: Date.now(),
      user_from: findNextUser.userId,
      user_to: randomUser ? String(randomUser.userId) : null,
      position_from: findMe.position,
      position_to: randomUser ? String(randomUser.position) : null,
      status,
    }

    await this.redisService.pub(`roomId:${payload.roomId}`, {
      roomId: payload.roomId,
      userId: payload.userId,
      type: RedisEvents.GameTick,
      data: gameData,
    })

    await this.redisStore.updateGameState(payload.roomId, gameData)
  }

  onListeners() {
    this.worker.on("completed", (job, returnvalue) => {
      console.log(`${job.id} has completed with returnvalue - ${returnvalue}!`)
    })

    this.worker.on("failed", (job, err) => {
      console.log(`${job?.id} has failed with ${err.message}`)
    })

    this.worker.on("ready", () => {
      console.log(`Worker has ready`)
    })

    this.worker.on("paused", () => {
      console.log(`Worker has paused`)
    })

    this.worker.on("resumed", () => {
      console.log(`Worker has resumed`)
    })
  }
}
