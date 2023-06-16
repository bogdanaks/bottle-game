import { RedisService } from "./service"

interface RedisControllerProps {
  redisService: RedisService
}

export class RedisController {
  private redisService

  constructor({ redisService }: RedisControllerProps) {
    this.redisService = redisService
  }
}
