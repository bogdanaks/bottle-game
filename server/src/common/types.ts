import { MessageEntity } from "@/modules/message"

export interface Message {
  user: TgUser
  message: string
}

export interface TgUser {
  id: string
  first_name: string
  last_name: string
  language_code: string
  is_premium: boolean
}

export interface RoomsType {
  [roomId: string]: string[]
}

export interface NewMessage {
  message: string
  reply: MessageEntity
}
