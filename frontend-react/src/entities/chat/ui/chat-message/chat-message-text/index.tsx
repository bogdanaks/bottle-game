import dayjs from "dayjs"

import styles from "./styles.module.css"

interface ChatMessageTextProps {
  chatMessage: ChatMessage
}

export const ChatMessageText = ({ chatMessage }: ChatMessageTextProps) => {
  return (
    <div className={`text-sm break-words select-none font-light`}>
      <div className={styles.float}>
        <span className={styles.date}>{dayjs(chatMessage.created_at).format("HH:MM")}</span>
      </div>
      {chatMessage.message}
    </div>
  )
}
