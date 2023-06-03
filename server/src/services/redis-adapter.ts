import { createClient } from "redis"

interface PabPayload {
  roomId: string
  userId: string
  type: string
  data?: any
}

type SubCallback = (data: string) => void

export class RedisAdapter {
  public redisClient
  public pubClient
  public subClient

  constructor() {
    this.redisClient = createClient()
    this.pubClient = this.redisClient.duplicate()
    this.subClient = this.redisClient.duplicate()
  }

  public sub(roomId: string, cb: SubCallback) {
    if (!this.subClient.isReady) {
      throw new Error("Redis: Sub client is not ready")
    }
    this.subClient.pSubscribe(roomId, cb)
  }

  public async pub(roomId: string, payload: PabPayload) {
    if (!this.pubClient.isReady) {
      throw new Error("Redis: Pub client is not ready")
    }
    await this.pubClient.publish(roomId, JSON.stringify({ ...payload, type: "join" }))
  }

  public async isClientReady(client: typeof this.redisClient) {
    return client.isReady
  }

  public async connect() {
    this.redisClient.on("ready", () => console.log("Redis: Connected!"))
    this.redisClient.on("error", (err) => console.log("Redis: Client error", err))
    await this.redisClient.connect()

    this.pubClient.on("ready", () => console.log("Redis: Pub connected!"))
    this.pubClient.on("error", (err) => console.log("Redis: Pub client error", err))
    this.subClient.on("ready", () => console.log("Redis: Sub connected!"))
    this.subClient.on("error", (err) => console.log("Redis: Sub client error", err))

    await this.pubClient.connect()
    await this.subClient.connect()
  }
}
