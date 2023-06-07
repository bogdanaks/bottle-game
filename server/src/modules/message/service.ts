import { Request, Response } from "express"
import { AppDataSource } from "../../common/data-source"
import { MessageEntity } from "./message.entity"
import { RedisStore } from "@/services/redis-store"

interface MessageServiceProps {
  redisStore: RedisStore
}

export class MessageService {
  protected msgRepository
  private redisStore

  constructor({ redisStore }: MessageServiceProps) {
    this.msgRepository = AppDataSource.getRepository<MessageEntity>(MessageEntity)
    this.redisStore = redisStore
  }

  async getMessagesByRoom(roomId: string) {
    return await this.redisStore.getMessagesByRoom(roomId)
  }

  async getMessage(req: Request, res: Response) {
    try {
      return await this.msgRepository.find()
    } catch (error) {
      console.log(error)
    }
  }
}
