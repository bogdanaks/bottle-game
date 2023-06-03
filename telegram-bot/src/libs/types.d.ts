export interface ResultType {
  id: number
  name: string
  type: "private_supergroup"
  messages: MergeMessage[]
}

export type MergeMessage =
  | Message
  | MessageFile
  | MessagePhoto
  | MessageReply
  | MessageForward
  | MessageEdited

export interface Message {
  id: number
  type: "message"
  date: string
  date_unixtime: string
  from: string
  from_id: string
  text: TextTypeData
  text_entities: TextEntity[]
}

export interface MessageFile extends Message {
  file?: string
  thumbnail?: string
  media_type?: "voice_message" | "video_file"
  mime_type?: string
  duration_seconds?: number
}

export interface MessagePhoto extends Message {
  photo?: string
  width?: number
  height?: number
}

export interface MessageReply extends Message {
  reply_to_message_id?: number
}

export interface MessageForward extends Message {
  forwarded_from?: string
}

export interface MessageEdited extends Message {
  edited?: string
  edited_unixtime?: string
}

type TextType = "plain" | "mention" | "italic"

type TextTypeString = string
type TextTypeObject = {
  type: TextType
  text: string
}

type TextTypeData =
  | TextTypeString
  | TextTypeString[]
  | TextTypeObject[]
  | (TextTypeString | TextTypeObject)[]

interface TextEntity {
  type: TextType
  text: string
}
