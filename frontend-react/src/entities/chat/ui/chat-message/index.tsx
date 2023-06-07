import classNames from "classnames"
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "framer-motion"
import { useEffect } from "react"

import { useAppDispatch } from "app/hooks"

import { setReply } from "entities/chat/model/slice"
import { useChatMessage } from "entities/chat/model/use-chat-message"
import { useTelegram } from "entities/telegram/model"
import { UserAvatar } from "entities/user/ui"

import { ChatMessageReply } from "./chat-message-reply"
import { ChatMessageReplyIcon } from "./chat-message-reply-icon"
import { ChatMessageText } from "./chat-message-text"
import { ChatMessageUserName } from "./chat-message-user-name"
import styles from "./styles.module.css"

interface ChatMessageProps {
  chatMessage: ChatMessage
  prevUser?: UserEntity
  nextUser?: UserEntity
}

export const ChatMessage = ({ chatMessage, prevUser, nextUser }: ChatMessageProps) => {
  const dispatch = useAppDispatch()
  const { haptic } = useTelegram()

  const { isMe, isFirst, isLast } = useChatMessage({
    chatMessage,
    prevUser,
    nextUser,
  })

  const x = useMotionValue(0)
  const spring = useSpring(x, { duration: 0.3, bounce: 0.8 })
  const opacity = useTransform(spring, [0, -200], [1, 0.4])
  const scale = useTransform(spring, [0, -50], [0, 1])
  const transform = useMotionTemplate`scale(${scale})`

  useEffect(() => {
    scale.on("change", (latest) => {
      if (latest < 0.99) return
      dispatch(setReply(chatMessage))
      haptic.impactOccurred("heavy")
    })

    return () => {
      scale.clearListeners()
    }
  }, [])

  return (
    <li
      className={classNames(styles.wrapper, {
        [styles.fromMe]: isMe,
        [styles.fromThem]: !isMe,
        [styles.isFirst]: isFirst,
        [styles.isLast]: isLast,
        [styles.hasTailMe]: isMe && isLast,
        [styles.hasTailThem]: !isMe && isLast,
      })}
    >
      <motion.div
        className={styles.container}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        initial={false}
        dragElastic={{ right: 0, left: 0.4 }}
        style={{ touchAction: "pan-y", x: spring, opacity }}
      >
        {!isMe &&
          (isLast ? <UserAvatar user={chatMessage.user} /> : <div className={styles.img} />)}

        <div className={styles.msg}>
          {!isMe && isFirst && <ChatMessageUserName user={chatMessage.user} />}
          {chatMessage.reply && <ChatMessageReply isMe={isMe} reply={chatMessage.reply} />}
          <ChatMessageText chatMessage={chatMessage} />
          <ChatMessageReplyIcon isLast={isLast} isMe={isMe} transform={transform} />
        </div>
      </motion.div>
    </li>
  )
}
