import classNames from "classnames"
import styles from "./styles.module.css"

interface ChatMessageReplyProps {
  isMe: boolean
  reply: ChatMessage
}

export const ChatMessageReply = ({ reply, isMe }: ChatMessageReplyProps) => {
  return (
    <div className="flex flex-row items-center mb-1">
      <div
        className={classNames(styles.divider, "w-[2px] mr-2 rounded-lg", {
          [styles.dividerThem]: !isMe,
        })}
      />
      <div className="flex flex-col">
        <span
          className={`${isMe ? styles.replyMe : styles.replyThem} cursor-pointer text-sm w-fit`}
        >
          {reply.user.first_name}
        </span>
        <span className="text-sm font-light">{reply.message}</span>
      </div>
    </div>
  )
}
