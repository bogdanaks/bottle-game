import { MainEntity } from "@/common/main-entity"
import { Entity, Column, OneToOne, JoinColumn, TreeParent } from "typeorm"
import { UserEntity } from "../user/user.entity"

@Entity("messages")
export class MessageEntity extends MainEntity {
  @Column()
  user_id: string

  @OneToOne(() => UserEntity, (user) => user.id, { eager: true })
  @JoinColumn({ name: "user_id" })
  user: UserEntity

  @Column()
  room_id: string

  @Column({ nullable: true })
  reply_id: string | null

  @TreeParent()
  @JoinColumn({ name: "reply_id" })
  reply: MessageEntity | null

  @Column()
  message: string
}
