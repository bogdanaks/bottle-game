import { GameCore } from "@/game-core"
import { Action } from "@/modules/action"
import { RedisService } from "@/modules/redis"
import { RedisStore } from "@/modules/redis-store"
import { UserToRoomService } from "@/modules/user-to-room/user-to-room.service"
import { createContainer, InjectionMode, asClass, AwilixContainer } from "awilix"

export const DI = createContainer({
  injectionMode: InjectionMode.PROXY,
}) as AwilixContainer<{
  action: Action
  gameCore: GameCore
  redisStore: RedisStore
  redisService: RedisService
  userToRoomService: UserToRoomService
}>

DI.register({
  action: asClass(Action).singleton(),
  redisService: asClass(RedisService).singleton(),
  redisStore: asClass(RedisStore).singleton(),
  gameCore: asClass(GameCore).singleton(),
  userToRoomService: asClass(UserToRoomService),
})
