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
  setMessages,
  setRoomId,
} from "entities/chat/model/slice"
import { setSocket, socket } from "entities/chat/model/socket"
import { pushHistory } from "entities/game/model/slice"
import { useTelegram } from "entities/telegram/model"

const SocketProvider = () => {
  const { user: tgUser } = useTelegram()
  const dispatch = useAppDispatch()
  const [socketConnected, setSocketConnected] = useState<Socket | null>(null)

  console.log("tgUser", tgUser)

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
        socketConnected.emit(SoketEvents.GameInit, (initState: InitState) => {
          dispatch(setInit(initState))
          initState.lastHistory && dispatch(pushHistory(initState.lastHistory))
        })
      }, 500)
    })

    // ROOMS
    socketConnected.on(SoketEvents.RoomUpdate, (roomId: string) => {
      dispatch(setRoomId(roomId))
    })
    socketConnected.on(SoketEvents.RoomUserJoin, (user: UserEntity) => {
      dispatch(joinUser(user))
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
    // socketConnected.on(SoketEvents.GameTick, (data: GamePayload) => {
    //   dispatch(setGameState(data.data))
    // })
    socketConnected.on(SoketEvents.HistoryPush, (data: HistoryEvent) => {
      dispatch(pushHistory(data))
    })

    socketConnected.connect()

    return () => {
      socketConnected.removeAllListeners()
      setSocketConnected(null)
      clearTimeout(timer)
    }
  }, [socketConnected])

  return socketConnected ? <Outlet /> : null
}

export default SocketProvider
