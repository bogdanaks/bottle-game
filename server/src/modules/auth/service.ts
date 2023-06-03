import { Repository } from "typeorm"
import { MessageEntity } from "../message"
import { AppDataSource } from "@/common/data-source"
import { UserService } from "../user"
import { TgUser } from "@/common/types"

interface AuthServiceProps {
  userService: UserService
}

export class AuthService {
  protected msgRepository: Repository<MessageEntity>
  protected userService

  constructor({ userService }: AuthServiceProps) {
    this.msgRepository = AppDataSource.getRepository<MessageEntity>(MessageEntity)
    this.userService = userService
  }

  async login({ id }: { id: string }) {
    return await this.userService.getUserById(id)
  }

  async signIn(user: TgUser) {
    return await this.userService.userAdd(user)
  }
}
