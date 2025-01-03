export enum SocketEvents {
  Connection = "connection",
  ConnectionError = "connect_error",
  Disconnect = "disconnect",
  GameStart = "game:start",
  MessageAdd = "message:add",
  MessageGet = "message:get",
  MessageUpdate = "message:update",
  RoomGet = "room:get",
  RoomUserJoin = "room:join",
  RoomUserLeave = "room:leave",
  UsersGet = "users:get",
  GameTick = "game:tick",
  GameInit = "game:init",
  HistoryPush = "history:push",
  SpinBottle = "spinBottle",
  KissUser = "kissUser",
}
