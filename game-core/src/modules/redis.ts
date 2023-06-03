import { createClient } from "redis"
import { RedisStore } from "./redis-store"

type ClientRedis = ReturnType<typeof createClient>
type SubCb = (data: string) => void
interface EventData {
  type: string
  userId: string
  roomId: string
  data?: any
}

export class RedisService {
  public parentClient: ClientRedis
  public pubClient: ClientRedis
  public subClient: ClientRedis
  public redisStore

  constructor({ redisStore }: { redisStore: RedisStore }) {
    this.parentClient = createClient()
    this.pubClient
    this.subClient
    this.redisStore = redisStore
  }

  public async start() {
    console.log("Redis: Start")
    await this.redisStore.start()
    this.parentClient.on("ready", () => console.log("Redis: Parent client connected!"))
    this.parentClient.on("error", (err) => console.log("Redis: Parent Client Error", err))
    await this.parentClient.connect().then(async () => {
      this.pubClient = await this.createDuplicate()
      this.subClient = await this.createDuplicate()
      console.log("Redis: All clients conect run")
    })
  }

  public async createDuplicate() {
    const newClient = this.parentClient.duplicate()
    newClient.on("ready", () => console.log("Redis: New client connected!"))
    newClient.on("error", (err) => console.log("Redis: New client Error", err))
    await newClient.connect()
    return newClient
  }

  public async pub(channel: string, payload: EventData) {
    if (!this.pubClient.isReady) {
      throw new Error("Redis: Pub client is not ready")
    }
    await this.pubClient.publish(channel, JSON.stringify(payload))
  }

  public sub(channel: string, cb: SubCb) {
    if (!this.subClient.isReady) {
      throw new Error("Redis: Sub client is not ready")
    }
    this.subClient.subscribe(channel, cb)
  }

  public subByClient(client: ClientRedis, channel: string, cb: SubCb) {
    if (!client.isReady) {
      throw new Error("Redis: subByClient is not ready")
    }
    client.subscribe(channel, cb)
  }

  public async quitByClient(client: ClientRedis) {
    if (!client.isReady) {
      throw new Error("Redis: quitByClient is not ready")
    }

    await client.quit()
  }
}
