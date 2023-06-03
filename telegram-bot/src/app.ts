import "dotenv/config"
import { Telegraf } from "telegraf"
import { message, either } from "telegraf/filters"

import { config } from "./config"
import { Message, Update } from "telegraf/typings/core/types/typegram"

const bot = new Telegraf(config.token)

async function main() {
  bot.start((ctx) => ctx.reply("Welcome"))

  bot.on("message", async (ctx) => {
    const msg = ctx.message as Update.New &
      Update.NonChannel &
      Message &
      Message.PhotoMessage &
      Message.TextMessage

    console.log("Message:", msg)
    const msgText = msg.text
    console.log("Message text:", msgText)

    ctx.reply(msgText)
  })

  bot.on("callback_query", async (ctx) => {
    ctx.answerGameQuery("https://6194-188-242-76-171.ngrok-free.app")
  })

  bot.launch()
  console.log("Bot started!")

  // Enable graceful stop
  process.once("SIGINT", () => bot.stop("SIGINT"))
  process.once("SIGTERM", () => bot.stop("SIGTERM"))
}

main()
