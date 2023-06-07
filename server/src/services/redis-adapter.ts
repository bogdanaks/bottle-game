import { Callback, Redis } from "ioredis"

interface PabPayload {
  roomId: string
  userId: string
  type: string
  data?: any
}

export class RedisAdapter {
  public pubClient
  public subClient

  constructor() {
    this.pubClient = new Redis()
    this.subClient = new Redis()
  }

  public sub(roomId: string, cb: any) {
    this.subClient.psubscribe(roomId, cb)
  }

  public async pub(roomId: string, payload: PabPayload) {
    if (this.pubClient.status !== "ready") {
      throw new Error("Redis: Pub client is not ready")
    }
    await this.pubClient.publish(`roomId:${roomId}`, JSON.stringify(payload))
  }

  public async isClientReady(client: Redis) {
    return client.status === "ready"
  }

  public on(event: "pmessage", cb: (pattern: string, channel: string, message: string) => void) {
    return this.subClient.on(event, cb)
  }
}
