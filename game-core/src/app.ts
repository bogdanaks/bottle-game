import { DI } from "./common/di"

async function main() {
  try {
    await DI.cradle.gameCore.run()
  } catch (err) {
    throw err
  }
}

main()
