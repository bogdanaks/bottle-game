import { Request, Response } from "express"
import { Repository } from "typeorm"
import { AppDataSource } from "../../common/data-source"
import { MessageEntity } from "./message.entity"

export class MessageService {
  protected msgRepository: Repository<MessageEntity>
  constructor() {
    this.msgRepository = AppDataSource.getRepository<MessageEntity>(MessageEntity)
  }

  async getMessage(req: Request, res: Response) {
    try {
      return await this.msgRepository.find()
    } catch (error) {
      console.log(error)
    }
  }
}
