import { Socket, io } from "socket.io-client"

import { config } from "shared/config"

export let socket: Socket

export function setSocket(userId: number) {
  socket = io(config.API_URL, {
    autoConnect: false,
    auth: {
      user_id: userId,
    },
    reconnectionDelay: 10000,
    reconnectionDelayMax: 10000,
  })

  return socket
}
