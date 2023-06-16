import { createContainer, InjectionMode, asClass } from "awilix"
import { AuthController } from "@/modules/auth"
import { AuthService } from "@/modules/auth/service"
import { UserController, UserService } from "@/modules/user"
import { IoConnector } from "../modules/socket/io"
import { TelegramService } from "@/modules/telegram/service"
import { RedisService } from "@/modules/redis/service"
import { SocketService } from "@/modules/socket/service"
import { SocketController } from "@/modules/socket"
import { Game } from "@/modules/game/game"
import { Room } from "@/modules/game/room"
import { User } from "@/modules/game/user"
import { ChatController } from "@/modules/chat"
import { ChatService } from "@/modules/chat/service"

export const DI = createContainer({
  injectionMode: InjectionMode.PROXY,
})

DI.register({
  ioConnector: asClass(IoConnector).singleton(),
  userService: asClass(UserService),
  authController: asClass(AuthController),
  authService: asClass(AuthService),
  userController: asClass(UserController),
  tgService: asClass(TelegramService),
  redisService: asClass(RedisService).singleton(),
  socketController: asClass(SocketController),
  socketService: asClass(SocketService),
  chatController: asClass(ChatController),
  chatService: asClass(ChatService),
  game: asClass(Game),
  room: asClass(Room),
  user: asClass(User),
})
