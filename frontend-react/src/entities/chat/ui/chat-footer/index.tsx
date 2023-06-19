import { useState } from "react"
import { HiOutlineArrowUturnLeft, HiOutlinePaperAirplane, HiOutlineXMark } from "react-icons/hi2"

import { useAppDispatch, useAppSelector } from "app/hooks"

import { useSendMessageMutation } from "entities/chat/api"
import { addMessage, selectChat, setReply } from "entities/chat/model/slice"
import { useTelegram } from "entities/telegram/model"

import styles from "./styles.module.css"

export const ChatFooter = () => {
  const dispatch = useAppDispatch()
  const { reply } = useAppSelector(selectChat)
  const [sendMessage] = useSendMessageMutation()
  const { haptic } = useTelegram()

  const [input, setInput] = useState("")

  const handleSendMessage = async () => {
    if (!input.length) return

    setInput("")
    handleReplyClose()
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })

    const newMsg = await sendMessage({
      message: input.trimStart(),
      reply,
    }).unwrap()
    dispatch(addMessage(newMsg))
    haptic.impactOccurred("heavy")
  }

  const handleReplyClose = () => {
    dispatch(setReply(null))
  }

  return (
    <div className={`flex flex-col justify-between ${styles.wrapper}`}>
      {reply && (
        <div className={`flex flex-row items-center ml-2 mr-2 pl-4 pr-4 ${styles.replyContainer}`}>
          <div className={styles.iconLeft}>
            <HiOutlineArrowUturnLeft fontSize={24} />
          </div>
          <div className={`w-[2px] ml-4 rounded-lg ${styles.divider}`} />
          <div className="ml-2 flex flex-col">
            <span className={`text-sm ${styles.replyName}`}>{reply.user.first_name}</span>
            <span className={`text-sm ${styles.replyMessage}`}>{reply.message}</span>
          </div>
          <div
            className={`ml-auto h-full flex items-center justify-end ${styles.iconRight}`}
            onClick={handleReplyClose}
          >
            <HiOutlineXMark fontSize={24} />
          </div>
        </div>
      )}
      <div className={`flex flex-row items-center pl-4 pr-4 m-2 mb-1 mt-1 ${styles.msgContainer}`}>
        <input
          type="text"
          className={`text-sm rounded-lg block w-full p-2.5 ${styles.input}`}
          placeholder="Введите сообщение.."
          required
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <button
          onClick={handleSendMessage}
          type="button"
          className={`text-white focus:outline-none font-medium rounded-lg text-center inline-flex items-center ${styles.button}`}
        >
          <HiOutlinePaperAirplane fontSize={24} />
        </button>
      </div>
    </div>
  )
}
