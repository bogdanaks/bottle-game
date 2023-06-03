import { Request, Response } from "express"
import { MessageService } from "./service"

interface MessageControllerProps {
  messageService: MessageService
}

export class MessageController {
  private messageService
  constructor({ messageService }: MessageControllerProps) {
    this.messageService = messageService
  }

  async getMessage(req: Request, res: Response) {
    const result = await this.messageService.getMessage(req, res)
    return res.send({ data: result })
  }
}
