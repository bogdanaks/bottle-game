import { useEffect, useState } from "react"
import { Outlet } from "react-router-dom"
import { Socket } from "socket.io-client"

import { useAppDispatch } from "app/hooks"

import { SoketEvents } from "entities/chat/model/enums"
import {
  addMessage,
  joinUser,
  leaveUser,
  setInit,
  setLoading,
  setMessages,
  setRoomId,
  setUsers,
} from "entities/chat/model/slice"
import { setSocket, socket } from "entities/chat/model/socket"
import { setGameState } from "entities/game/model/slice"
import { useTelegram } from "entities/telegram/model"

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
    let timer: NodeJS.Timeout

    socketConnected.on("connect", () => {
      // eslint-disable-next-line no-console
      console.log("Socket connect", socketConnected.id)

      timer = setTimeout(() => {
        socketConnected.emit(
          SoketEvents.GameInit,
          (initState: InitState & { gameState: GameData }) => {
            dispatch(setInit(initState))
            dispatch(setGameState(initState.gameState))
          }
        )
      }, 500)
    })

    // ROOMS
    socketConnected.on(SoketEvents.RoomUpdate, (roomId: string) => {
      dispatch(setRoomId(roomId))
    })
    socketConnected.on(SoketEvents.RoomUserJoin, (user: UserEntity) => {
      console.log("room:join", user.id)
      // dispatch(joinUser(user))
    })
    socketConnected.on(SoketEvents.RoomUserLeave, (user_id: string) => {
      dispatch(leaveUser(user_id))
    })

    // MESSAGES
    socketConnected.on(SoketEvents.MessageUpdateAll, (messages: ChatMessage[]) => {
      dispatch(setMessages(messages))
    })
    socketConnected.on(SoketEvents.MessageUpdate, (message: ChatMessage) => {
      dispatch(addMessage(message))
    })

    // GAME
    socketConnected.on(SoketEvents.GameTick, (data: GamePayload) => {
      console.log("data", data)
      dispatch(setGameState(data.data))
    })

    socketConnected.connect()

    return () => {
      socketConnected.removeAllListeners()
      setSocketConnected(null)
      socketConnected.disconnect()
      clearTimeout(timer)
    }
  }, [socketConnected])

  return socketConnected ? <Outlet /> : null
}

export default SocketProvider
