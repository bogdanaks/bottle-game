import { GameCore } from "@/game-core"
import { RedisService } from "@/modules/redis"
import { RedisStore } from "@/modules/redis-store"
import { createContainer, InjectionMode, asClass, AwilixContainer } from "awilix"

export const DI = createContainer({
  injectionMode: InjectionMode.PROXY,
}) as AwilixContainer<{
  gameCore: GameCore
  redisStore: RedisStore
  redisService: RedisService
}>

DI.register({
  redisService: asClass(RedisService).singleton(),
  redisStore: asClass(RedisStore).singleton(),
  gameCore: asClass(GameCore).singleton(),
})
