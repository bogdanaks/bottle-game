import { DI } from "@/common/di"
import { Router } from "express"

const msgRouter = Router()

// msgRouter.route("/").get(DI.cradle.messageService.getMessage)

msgRouter.use("/msg", msgRouter)
export { msgRouter }
