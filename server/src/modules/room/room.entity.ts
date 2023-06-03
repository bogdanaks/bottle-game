import { MainEntity } from "@/common/main-entity"
import { Entity } from "typeorm"

@Entity("rooms")
export class RoomEntity extends MainEntity {}
