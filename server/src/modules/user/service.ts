import { TgUser } from "@/common/types"
import { In, Repository } from "typeorm"
import { UserEntity } from "./user.entity"
import { AppDataSource } from "@/common/data-source"
import { TelegramService } from "../telegram/service"
import { RedisStore } from "@/services/redis-store"

interface UserServiceProps {
  tgService: TelegramService
  redisStore: RedisStore
}

export class UserService {
  protected userRepository: Repository<UserEntity>
  private tgService: TelegramService
  private redisStore

  constructor({ tgService, redisStore }: UserServiceProps) {
    this.tgService = tgService
    this.redisStore = redisStore
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

  async getUserById(userId: string) {
    return await this.userRepository.findOne({ where: { id: userId } })
  }

  async getUsersByIds(userIds: string[]) {
    return await this.userRepository.find({ where: { id: In(userIds) } })
  }
}
