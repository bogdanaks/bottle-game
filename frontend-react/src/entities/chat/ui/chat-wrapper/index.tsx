import { ChatFooter } from "../chat-footer"
import { ChatMessages } from "../chat-messages"
import styles from "./styles.module.css"

export const ChatWrapper = () => {
  return (
    <div className={styles.wrapper}>
      <ChatMessages />
      <ChatFooter />
    </div>
  )
}
