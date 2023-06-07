import { RedisStore } from "./redis-store"
import { Redis } from "ioredis"

interface EventData {
  type: string
  userId: string
  roomId: string
  data?: any
}

export class RedisService {
  private pubClient: Redis
  private subClient: Redis

  constructor() {
    this.pubClient = new Redis()
    this.subClient = new Redis()
  }

  public async pub(channel: string, payload: EventData) {
    console.log(`Pub to ${channel} payload - ${JSON.stringify(payload)}`)
    await this.pubClient.publish(channel, JSON.stringify(payload))
  }

  public sub(channel: string) {
    this.subClient.psubscribe(channel, (err, count) => {
      if (err) console.error(err.message)
      console.log(`Subscribed to ${count} channels.`)
    })
  }

  public subByClient(client: Redis, channel: string, cb: any) {
    client.psubscribe(channel, cb)
  }

  public async quitByClient(client: Redis) {
    await client.quit()
  }

  public on(event: "pmessage", cb: (pattern: string, channel: string, message: string) => void) {
    return this.subClient.on(event, cb)
  }
}
