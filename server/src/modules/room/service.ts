import { Repository } from "typeorm"
import { AppDataSource } from "@/common/data-source"
import { RoomEntity } from "./room.entity"
import { IoType } from "../chat/types"
import { UserToRoomEntity } from "../user-to-room/user-to-room.entity"
import { UserEntity } from "../user"

interface RoomServiceProps {
  io: IoType
}

export class RoomService {
  protected roomRepository: Repository<RoomEntity>
  protected userToRoomRepository: Repository<UserToRoomEntity>
  protected io

  constructor({ io }: RoomServiceProps) {
    this.roomRepository = AppDataSource.getRepository<RoomEntity>(RoomEntity)
    this.userToRoomRepository = AppDataSource.getRepository<UserToRoomEntity>(UserToRoomEntity)
    this.io = io
  }

  async getFreeRoom() {
    const activeRoomsWithFreeSlots = await this.userToRoomRepository
      .createQueryBuilder()
      .select("room_id")
      .groupBy("room_id")
      .having("count(*) < 2")
      .getRawMany()

    if (!activeRoomsWithFreeSlots.length) {
      const activeRoomsIds = this.userToRoomRepository
        .createQueryBuilder("ur")
        .select("room_id")
        .getQuery()

      const freeRoom = await this.roomRepository
        .createQueryBuilder("room")
        .where(`id NOT IN (${activeRoomsIds})`)
        .orderBy({
          id: "ASC",
        })
        .getOne()

      if (!freeRoom) {
        const newRoom = await this.createRoom()
        return String(newRoom.id)
      }

      return String(freeRoom.id)
    }

    return activeRoomsWithFreeSlots[0].room_id
  }

  async createRoom(): Promise<RoomEntity> {
    return (await this.roomRepository.insert({})).raw[0]
  }

  async getRoomPlayers(roomId: string) {
    const rooms = await this.userToRoomRepository.find({
      where: { room_id: roomId },
    })
    if (!rooms.length) return []

    return rooms.map((room) => room.user)
  }

  async joinToRoom(roomId: string, userId: string) {
    const queryRunner = AppDataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()
    let joinRoomId = roomId
    const user = await queryRunner.manager.findOneBy(UserEntity, { id: userId })
    if (!user) {
      throw new Error("User undefined")
    }

    try {
      const beforeRoom = await this.getPlayerRoom(userId)
      if (beforeRoom) {
        joinRoomId = beforeRoom.room_id
        return
      }

      await queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into(UserToRoomEntity)
        .values({ room_id: roomId, user_id: userId })
        .onConflict(`("id") DO NOTHING`)
        .execute()

      await queryRunner.commitTransaction()
    } catch (err) {
      await queryRunner.rollbackTransaction()
    } finally {
      await queryRunner.release()
    }
  }

  async leaveRoom(userId: string) {
    const playerRoom = await this.getPlayerRoom(userId)
    if (!playerRoom) return
    console.log(`user ${userId} leave from ${playerRoom.room_id}`)
    await this.userToRoomRepository.delete({ room_id: playerRoom.room_id, user_id: userId })
  }

  async getPlayersInRoom(roomId: string) {
    return await this.userToRoomRepository.find({ where: { room_id: roomId } })
  }

  async getPlayerRoom(userId: string) {
    return await this.userToRoomRepository.findOneBy({ user_id: userId })
  }

  async getRooms() {
    return await this.roomRepository.find()
  }
}
