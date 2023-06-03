import { createContainer, InjectionMode, asClass, AwilixContainer } from "awilix"
import { ChatController, ChatService } from "@/modules/chat"
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
import { SocketService } from "@/services/socket"

export const DI = createContainer({
  injectionMode: InjectionMode.PROXY,
}) as AwilixContainer<{
  socketService: SocketService
  redisAdapter: RedisAdapter
  redisService: RedisService
  io: typeof io
  ioConnector: IoConnector
  tgService: TelegramService
  userService: UserService
  chatService: ChatService
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
  socketService: asClass(SocketService).singleton(),
  redisAdapter: asClass(RedisAdapter).singleton(),
  redisService: asClass(RedisService).singleton(),
  ioConnector: asClass(IoConnector).singleton(),
  chatController: asClass(ChatController),
  tgService: asClass(TelegramService),
  userService: asClass(UserService),
  chatService: asClass(ChatService),
  authController: asClass(AuthController),
  authService: asClass(AuthService),
  messageController: asClass(MessageController),
  messageService: asClass(MessageService),
  roomService: asClass(RoomService),
  roomController: asClass(RoomController),
  userController: asClass(UserController),
})
