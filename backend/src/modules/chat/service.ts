import { RedisService } from "../redis/service"
import { NewMessage } from "@/common/types"

interface ChatServiceProps {
  redisService: RedisService
}

export class ChatService {
  private redisService

  constructor({ redisService }: ChatServiceProps) {
    this.redisService = redisService
  }

  async getMessagesByRoom(roomId: string) {
    return await this.redisService.getMessages(roomId)
  }

  async addMessage(roomId: string, newMessage: NewMessage) {
    return await this.redisService.addMessage(roomId, newMessage)
  }
}
