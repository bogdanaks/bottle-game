import { createContainer, InjectionMode, asClass, AwilixContainer } from "awilix"
import { ChatController } from "@/modules/chat"
import { AuthController } from "@/modules/auth"
import { AuthService } from "@/modules/auth/service"
import { MessageController, MessageService } from "@/modules/message"
import { RoomController, RoomService } from "@/modules/room"
import { TelegramService } from "@/modules/telegram/service"
import { UserController, UserService } from "@/modules/user"
import { IoConnector } from "./io"
import { io } from "@/app"
import { RedisService } from "@/services/redis"
import { RedisAdapter } from "@/services/redis-adapter"
import { SocketService } from "@/services/socket-service"
import { RedisStore } from "@/services/redis-store"

export const DI = createContainer({
  injectionMode: InjectionMode.PROXY,
}) as AwilixContainer<{
  socketService: SocketService
  redisAdapter: RedisAdapter
  redisService: RedisService
  redisStore: RedisStore
  io: typeof io
  ioConnector: IoConnector
  tgService: TelegramService
  userService: UserService
  chatController: ChatController
  authController: AuthController
  authService: AuthService
  messageController: MessageController
  messageService: MessageService
  roomController: RoomController
  roomService: RoomService
  userController: UserController
}>

DI.register({
  redisStore: asClass(RedisStore).singleton(),
  socketService: asClass(SocketService).singleton(),
  redisAdapter: asClass(RedisAdapter).singleton(),
  redisService: asClass(RedisService).singleton(),
  ioConnector: asClass(IoConnector).singleton(),
  chatController: asClass(ChatController),
  tgService: asClass(TelegramService),
  userService: asClass(UserService),
  authController: asClass(AuthController),
  authService: asClass(AuthService),
  messageController: asClass(MessageController),
  messageService: asClass(MessageService),
  roomService: asClass(RoomService),
  roomController: asClass(RoomController),
  userController: asClass(UserController),
})
