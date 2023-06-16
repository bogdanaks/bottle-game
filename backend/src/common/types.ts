import { UserEntity } from "@/modules/user"
import { Server } from "socket.io"
import { Handshake, Socket } from "socket.io/dist/socket"
import { DefaultEventsMap } from "socket.io/dist/typed-events"

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
  reply: unknown
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
  type: string
  data?: any
}

export interface UserInRoom {
  userId: string
  position: string
  hearts: number
}

export interface GameState {
  status: string
  history: HistoryEvent[]
}

export interface HistoryEvent {
  event: string
  timestamp: string
  payload?: any
}

export interface GameInit {
  socketId: string
  roomId: string
  messages: NewMessage[]
  users: UserEntity[]
  lastHistory?: HistoryEvent | null
}

export interface UserEntityWithPosition extends UserEntity {
  position: string
}
