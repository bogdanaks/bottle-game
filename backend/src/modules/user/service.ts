import { TgUser } from "@/common/types"
import { In } from "typeorm"
import { UserEntity } from "./user.entity"
import { AppDataSource } from "@/common/data-source"
import { TelegramService } from "../telegram/service"
import { RedisService } from "../redis/service"

interface UserServiceProps {
  tgService: TelegramService
  redisService: RedisService
}

export class UserService {
  protected userRepository
  private tgService
  private redisService

  constructor({ tgService, redisService }: UserServiceProps) {
    this.tgService = tgService
    this.userRepository = AppDataSource.getRepository<UserEntity>(UserEntity)
    this.redisService = redisService
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
    const userCache = await this.redisService.getUserById(userId)
    if (userCache) {
      return JSON.parse(userCache) as UserEntity
    }

    const userFind = await this.userRepository.findOne({ where: { id: userId } })
    if (userFind) {
      this.redisService.saveUser(userFind)
    }

    return userFind
  }

  async getUsersByIds(userIds: string[]): Promise<UserEntity[]> {
    const cachedUsers: UserEntity[] = []
    for (const userId of userIds) {
      const userCache = await this.getUserById(userId)
      if (!userCache) {
        throw new Error("user undefined")
      }
      cachedUsers.push(userCache)
    }
    return cachedUsers
  }
}
