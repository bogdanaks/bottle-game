import { Router } from "express"

const chatRouter = Router()

// chatRouter.route("/room").get(ChatController.getRooms)

chatRouter.use("/chat", chatRouter)
export { chatRouter }
