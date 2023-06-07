import { useAppSelector } from "app/hooks"

import { selectChat } from "entities/chat/model/slice"

import { Bottle } from "../bottle"
import { Player } from "../player"
import styles from "./styles.module.css"

export const Room = () => {
  const { roomId, users } = useAppSelector(selectChat)

  return (
    <div className={styles.wrapper}>
      <div className={styles.tableHeader}>Room: {roomId}</div>
      <div className={styles.tableContainer}>
        <Bottle />
        <ul className={styles.players}>
          {Array(8)
            .fill(0)
            .map((_, index) => {
              const findUser = users.find((u) => Number(u.position) === index + 1)
              if (findUser) return <Player key={index} player={findUser} />
              return <li key={index} className={styles.player} />
            })}
        </ul>
      </div>
    </div>
  )
}
