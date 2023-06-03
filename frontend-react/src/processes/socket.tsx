import { useAppDispatch } from "app/hooks"
import { useEffect, useState } from "react"

import {
  addMessage,
  joinUser,
  leaveUser,
  setMessages,
  setRoomId,
  setUsers,
} from "entities/chat/model/slice"
import { useTelegram } from "entities/telegram/model"

import { Outlet } from "react-router-dom"
import { setSocket, socket } from "entities/chat/model/socket"
import { SoketEvents } from "entities/chat/model/enums"
import { Socket } from "socket.io-client"

const SocketProvider = () => {
  const { user: tgUser } = useTelegram()
  const dispatch = useAppDispatch()
  const [socketConnected, setSocketConnected] = useState<Socket | null>(null)

  useEffect(() => {
    if (!tgUser) return

    const socketCon = !socket ? setSocket(tgUser.id) : socket
    setSocketConnected(socketCon)
  }, [])

  useEffect(() => {
    if (!socketConnected) return

    socketConnected.on("connect", () => {
      // eslint-disable-next-line no-console
      console.log("Socket connect", socketConnected.id)
      socketConnected.emit(SoketEvents.RoomGet)
      socketConnected.emit(SoketEvents.UsersGet)
      socketConnected.emit(SoketEvents.MessageGet)
    })

    // ROOMS
    socket.on(SoketEvents.RoomUpdate, (roomId: string) => {
      dispatch(setRoomId(roomId))
    })
    socketConnected.on(SoketEvents.RoomUserJoin, (user: UserEntity) => {
      console.log("room:join", user.id)
      // dispatch(joinUser(user))
    })
    socketConnected.on(SoketEvents.RoomUserLeave, (user_id: string) => {
      dispatch(leaveUser(user_id))
    })

    // USERS
    socketConnected.on(SoketEvents.UsersUpdateAll, (users: UserEntity[]) => {
      dispatch(setUsers(users))
    })

    // MESSAGES
    socketConnected.on(SoketEvents.MessageUpdateAll, (messages: ChatMessage[]) => {
      dispatch(setMessages(messages))
    })
    socketConnected.on(SoketEvents.MessageUpdate, (message: ChatMessage) => {
      dispatch(addMessage(message))
    })

    socketConnected.connect()

    return () => {
      socketConnected.removeAllListeners()
      setSocketConnected(null)
      socketConnected.disconnect()
    }
  }, [socketConnected])

  return socketConnected ? <Outlet /> : null
}

export default SocketProvider
