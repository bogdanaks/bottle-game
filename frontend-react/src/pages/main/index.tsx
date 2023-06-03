import { ChatWrapper } from "entities/chat/ui/chat-wrapper"
// import { Room } from "entities/room/ui/room"

import { Wrapper } from "shared/ui/wrapper"

import styles from "./styles.module.css"
import { ConsoleInfo } from "shared/ui/console"
import { Room } from "entities/room/ui/room"

const MainPage = () => {
  return (
    <Wrapper>
      <div className={styles.top}>
        <Room />
      </div>
      <div className={styles.bottom}>
        <ChatWrapper />
      </div>
      <ConsoleInfo />
    </Wrapper>
  )
}

export default MainPage
