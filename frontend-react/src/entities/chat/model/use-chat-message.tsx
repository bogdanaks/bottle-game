import { useSpring } from "@react-spring/web"
import { useDrag } from "@use-gesture/react"

import { useTelegram } from "entities/telegram/model"

interface UseMessageProps {
  chatMessage: ChatMessage
  prevUser?: UserEntity
  nextUser?: UserEntity
}

export const useChatMessage = ({ chatMessage, nextUser, prevUser }: UseMessageProps) => {
  const { user: tgUser } = useTelegram()
  const [spring, api] = useSpring(() => ({ x: 0 }))
  const isMe = Number(tgUser.id) === Number(chatMessage.user.id)

  const bind = useDrag(
    ({ down, offset: [x] }) => {
      return api.start({ x: down ? x : 0, immediate: down, reset: x > 0 })
    },
    {
      axis: "x",
      swipe: {
        distance: 0,
        duration: 100,
      },
    }
  )

  return {
    isMe,
    isFirst: prevUser ? prevUser.id !== chatMessage.user.id : false,
    isLast: nextUser ? nextUser.id !== chatMessage.user.id : true,
    bind,
    spring,
  }
}
