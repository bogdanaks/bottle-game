import classNames from "classnames"
import { MotionValue, motion } from "framer-motion"
import { HiChatBubbleOvalLeftEllipsis } from "react-icons/hi2"

import styles from "./styles.module.css"

interface ChatMessageReplyIconProps {
  isLast: boolean
  isMe: boolean
  transform: MotionValue<string>
}

export const ChatMessageReplyIcon = ({ isLast, isMe, transform }: ChatMessageReplyIconProps) => {
  return (
    <motion.div
      className={classNames(styles.reply, { [styles.replyBig]: isLast && isMe })}
      style={{ transform }}
    >
      <HiChatBubbleOvalLeftEllipsis fontSize={24} color="#d1d5db" />
    </motion.div>
  )
}
