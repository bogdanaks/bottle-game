import "reflect-metadata"
import * as dotenv from "dotenv"
dotenv.config()

import { DI } from "./common/di"
import { AppDataSource } from "./common/data-source"

async function main() {
  try {
    AppDataSource.initialize()
      .then(async () => {
        console.log("Database run on port 5432")
        await DI.cradle.gameCore.run()
      })
      .catch(async (err) => {
        console.error("Error initialization:", err)
      })
  } catch (err) {
    throw err
  }
}

main()
