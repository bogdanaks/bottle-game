import { MessageEntity } from "@/modules/message"
import { UserEntity } from "@/modules/user"
import { Server } from "socket.io"
import { Handshake, Socket } from "socket.io/dist/socket"
import { DefaultEventsMap } from "socket.io/dist/typed-events"
import { SocketEvents } from "./socket-events"

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
  user: UserEntity
  message: string
  reply: MessageEntity
}

type HandshakeAuth = {
  user_id: number
}
type HandshakeExtends = Omit<Handshake, "auth"> & { auth: HandshakeAuth }

type SocketTypeInit = Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
export type SocketType = Omit<SocketTypeInit, "handshake"> & {
  handshake: HandshakeExtends
} & { data: { user: UserEntity; test: string } }

export type IoType = Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
export type Payload = {
  roomId: string
  userId: string
  type: SocketEvents
  data?: any
}

export interface UserInRoom {
  userId: string
  position: string
}

export interface GameState {
  tick_time: number
  user_from: string
  user_to: string | null
  position_from: string
  position_to: string
}
