import { DataSource } from "typeorm"
import { databaseConfig } from "../config"
import { UserEntity } from "@/modules/user-to-room/user.entity"

export const AppDataSource = new DataSource({
  type: "postgres",
  host: databaseConfig.host,
  port: databaseConfig.port,
  username: databaseConfig.user,
  password: databaseConfig.password,
  database: databaseConfig.name,
  entities: [UserEntity],
  logging: false,
  synchronize: false,
})
