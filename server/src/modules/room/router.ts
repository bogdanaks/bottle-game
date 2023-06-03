import { DI } from "@/common/di"
import { Router, Request, Response } from "express"
import { makeInvoker } from "awilix-express"
import { RoomController } from "./controller"

const roomRouter = Router()

function makeAPI({ roomController }: { roomController: RoomController }) {
  return {
    findAll: (req: Request, res: Response) => roomController.getRooms(req, res),
    findFreeRoom: (req: Request, res: Response) => roomController.getFreeRoom(req, res),
    findRoomPlayers: (req: Request, res: Response) => roomController.getRoomPlayers(req, res),
  }
}

const api = makeInvoker(makeAPI)

roomRouter.get("/", api("findAll"))
roomRouter.get("/free", api("findFreeRoom"))
roomRouter.get("/players", api("findRoomPlayers"))

roomRouter.use("/room", roomRouter)
export { roomRouter }
