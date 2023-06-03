import { MainEntity } from "@/common/main-entity"
import { Column, Entity, JoinColumn, OneToOne } from "typeorm"
import { UserEntity } from "../user/user.entity"
import { RoomEntity } from "../room/room.entity"

@Entity("users_to_rooms")
export class UserToRoomEntity extends MainEntity {
  @Column()
  user_id: string

  @OneToOne(() => UserEntity, (user) => user.id, { eager: true })
  @JoinColumn({ name: "user_id" })
  user: UserEntity

  @Column()
  room_id: string

  @OneToOne(() => RoomEntity, (room) => room.id, { eager: true })
  @JoinColumn({ name: "room_id" })
  room: RoomEntity
}
