import { TgUser } from "@/common/types"
import { Repository } from "typeorm"
import { UserEntity } from "./user.entity"
import { AppDataSource } from "@/common/data-source"
import { TelegramService } from "../telegram/service"

interface UserServiceProps {
  tgService: TelegramService
}

export class UserService {
  protected userRepository: Repository<UserEntity>
  private tgService: TelegramService

  constructor({ tgService }: UserServiceProps) {
    this.tgService = tgService
    this.userRepository = AppDataSource.getRepository<UserEntity>(UserEntity)
  }

  async userAdd(user: TgUser) {
    const userPhoto = await this.tgService.getUserPhoto(user.id)
    if (!userPhoto) return

    await this.tgService.saveUserPhoto(userPhoto, user.id)
    const photoUrl = `/photos/${user.id}.jpg`
    await this.userRepository.save({ ...user, photo_url: photoUrl })

    return {
      ...user,
      photo_url: photoUrl,
    }
  }

  async getUserById(id: string) {
    return await this.userRepository.findOne({ where: { id } })
  }
}
