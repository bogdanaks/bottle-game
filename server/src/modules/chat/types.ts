import { Server, Socket } from "socket.io"
import { Handshake } from "socket.io/dist/socket"
import { DefaultEventsMap } from "socket.io/dist/typed-events"
import { UserEntity } from "../user"

type HandshakeAuth = {
  user_id: number
}
type HandshakeExtends = Omit<Handshake, "auth"> & { auth: HandshakeAuth }

export type IoType = Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>

type SocketTypeInit = Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
export type SocketType = Omit<SocketTypeInit, "handshake"> & {
  handshake: HandshakeExtends
} & { data: { user: UserEntity; test: string } }
