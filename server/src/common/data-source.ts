import { MessageEntity } from "../modules/message/message.entity"
import { DataSource } from "typeorm"
import { databaseConfig } from "../config"
import { UserEntity } from "../modules/user/user.entity"
import { RoomEntity } from "@/modules/room/room.entity"

export const AppDataSource = new DataSource({
  type: "postgres",
  host: databaseConfig.host,
  port: databaseConfig.port,
  username: databaseConfig.user,
  password: databaseConfig.password,
  database: databaseConfig.name,
  entities: [UserEntity, MessageEntity, RoomEntity],
  logging: false,
  synchronize: false,
})
