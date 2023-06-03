import { Request, Response } from "express"
import { RoomService } from "./service"

interface RoomControllerProps {
  roomService: RoomService
}

export class RoomController {
  private roomService

  constructor({ roomService }: RoomControllerProps) {
    this.roomService = roomService
  }

  async getRooms(req: Request, res: Response) {
    const rooms = await this.roomService.getRooms()
    return res.send({ data: rooms })
  }

  async getFreeRoom(req: Request, res: Response) {
    const room = await this.roomService.getFreeRoom()
    return res.send({ data: room })
  }

  async getRoomPlayers(req: Request, res: Response) {
    const roomId = req.query.room_id
    if (!roomId) {
      return res.send({ error: "room_id is required" })
    }

    const players = await this.roomService.getRoomPlayers(String(roomId))
    return res.send({ data: players })
  }
}
