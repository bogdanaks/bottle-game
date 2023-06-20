import { useSpring } from "@react-spring/web"

import { useTelegram } from "entities/telegram/model"

interface UseMessageProps {
  chatMessage: ChatMessage
  prevUser?: UserEntity
  nextUser?: UserEntity
}

export const useChatMessage = ({ chatMessage, nextUser, prevUser }: UseMessageProps) => {
  const { user: tgUser } = useTelegram()
  const [spring] = useSpring(() => ({ x: 0 }))
  const isMe = Number(tgUser.id) === Number(chatMessage.user.id)

  return {
    isMe,
    isFirst: prevUser ? prevUser.id !== chatMessage.user.id : false,
    isLast: nextUser ? nextUser.id !== chatMessage.user.id : true,
    spring,
  }
}
