import { useEffect, useRef } from "react"

import { useAppSelector } from "app/hooks"

import { selectChat } from "entities/chat/model/slice"

import { ChatMessage } from "../chat-message"
import styles from "./styles.module.css"

export const ChatMessages = () => {
  const chat = useAppSelector(selectChat)
  const messagesListRef = useRef<HTMLUListElement | null>(null)

  useEffect(() => {
    if (!messagesListRef.current) return

    messagesListRef.current.scrollTo({
      top: messagesListRef.current.scrollHeight,
      behavior: "smooth",
    })
  }, [chat])

  return (
    <ul
      className={`${styles.wrapper} pb-2 pl-2 pr-2 pt-1`}
      ref={messagesListRef}
      id="messages-list"
    >
      {chat.messages.map((msg, index, array) => (
        <ChatMessage
          key={index}
          chatMessage={msg}
          prevUser={array[index - 1] ? array[index - 1].user : undefined}
          nextUser={array[index + 1] ? array[index + 1].user : undefined}
        />
      ))}
    </ul>
  )
}
