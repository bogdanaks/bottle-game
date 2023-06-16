import { NewMessage } from "@/common/types"
import { ChatService } from "./service"
import { UserEntity } from "../user"

interface ChatControllerProps {
  chatService: ChatService
}

export class ChatController {
  private chatService

  constructor({ chatService }: ChatControllerProps) {
    this.chatService = chatService
  }

  async getMessagesByRoom(roomId: string) {
    return await this.chatService.getMessagesByRoom(roomId)
  }

  async addMessage(roomId: string, newMessage: NewMessage) {
    return await this.chatService.addMessage(roomId, newMessage)
  }
}
