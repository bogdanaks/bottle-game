export interface RoomEntity {
  //
}

export interface UserEntity {
  id: string
  first_name: string
  last_name: string
  language_code: string
  is_premium: boolean
  photo_url: string
  gender: string
  age: number
  created_at: string
  updated_at: string
}

export interface MessageEntity {
  user: UserEntity
  reply_id: string | null
  reply: MessageEntity | null
  message: string
}
