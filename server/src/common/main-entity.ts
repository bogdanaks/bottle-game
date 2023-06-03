import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"

export abstract class MainEntity {
  @PrimaryGeneratedColumn()
  id: string

  @CreateDateColumn()
  created_at: string

  @UpdateDateColumn()
  updated_at: string
}
