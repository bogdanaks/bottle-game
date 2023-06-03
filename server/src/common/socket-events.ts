export enum SocketEvents {
  Connection = "connection",
  ConnectionError = "connect_error",
  Disconnect = "disconnect",
  GameStart = "game:start",
  MessageAdd = "message:add",
  MessageGet = "message:get",
  MessageUpdate = "message:update",
  RoomUserJoin = "room:join",
  RoomUserLeave = "room:leave",
  UsersGet = "users:get",
}
