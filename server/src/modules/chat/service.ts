import { IoType, SocketType } from "./types"
import { NewMessage } from "common/types"
import { Repository, TreeRepository } from "typeorm"
import { MessageEntity } from "../message"
import { AppDataSource } from "@/common/data-source"
import { UserService } from "../user"
import { RoomService } from "../room"

interface ChatServiceProps {
  roomService: RoomService
  userService: UserService
  io: IoType
}

interface MessageAddProps {
  message: NewMessage
  roomId: string
  userId: string
}

export class ChatService {
  protected msgRepository: Repository<MessageEntity>
  protected roomService
  protected userService
  protected io

  constructor({ userService, roomService, io }: ChatServiceProps) {
    this.msgRepository = AppDataSource.getRepository(MessageEntity)
    this.roomService = roomService
    this.userService = userService
    this.io = io
  }

  async messageAdd({ roomId, message, userId }: MessageAddProps) {
    const queryRunner = AppDataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()
    let newMessageEntity: MessageEntity | null = null
    let replyMessage: MessageEntity | null = null

    try {
      if (message.reply) {
        replyMessage = await queryRunner.manager.findOneBy(MessageEntity, {
          id: message.reply.id,
        })
      }

      const userMsg = await this.userService.getUserById(userId)
      if (!userMsg) {
        throw new Error("User undefined")
      }

      const createMessage = new MessageEntity()
      createMessage.user = userMsg
      createMessage.user_id = userMsg.id
      createMessage.room_id = roomId
      createMessage.message = message.message
      createMessage.reply_id = replyMessage ? replyMessage.id : null
      createMessage.reply = replyMessage ? replyMessage : null
      newMessageEntity = await queryRunner.manager.save(createMessage)

      await queryRunner.commitTransaction()
    } catch (err) {
      await queryRunner.rollbackTransaction()
    } finally {
      await queryRunner.release()
      return newMessageEntity
    }
  }

  async messageGet(roomId: string) {
    console.log("messageGet", roomId)
    const messages = await this.msgRepository.find({
      where: { room_id: roomId },
      order: { created_at: "ASC" },
      relations: { reply: true },
    })

    // TODO выгести сообщения в Redis
    this.io.to(roomId).emit("message:update_all", messages)
  }

  async usersGet(roomId: string) {
    console.log("usersGet", roomId)
    const usersToRoom = await this.roomService.getPlayersInRoom(roomId)
    const users = usersToRoom.map((user) => user.user)

    this.io.to(roomId).emit("users:update_all", users, roomId)
  }
}
