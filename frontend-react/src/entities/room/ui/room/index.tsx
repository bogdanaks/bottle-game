import BottleImg from "shared/assets/images/bottle.png"

import styles from "./styles.module.css"
import { useAppSelector } from "app/hooks"
import { selectChat } from "entities/chat/model/slice"
import { config } from "shared/config"

export const Room = () => {
  const { roomId, users } = useAppSelector(selectChat)

  // const mockUsers = [...users, ...users, ...users].slice(0, 8)

  return (
    <div className={styles.wrapper}>
      <div className={styles.tableHeader}>Room: {roomId}</div>
      <div className={styles.tableContainer}>
        <div className={styles.bottle}>
          <img src={BottleImg} alt="Bottle" className={styles.bottleImg} />
        </div>
        <ul className={styles.players}>
          {users.map((user) => (
            <li key={user.id} className={styles.player}>
              <div className={styles.playerInner}>
                <div className={styles.playerImageBox}>
                  <img
                    src={`${config.API_URL}${user.photo_url}`}
                    alt="Player"
                    className={styles.image}
                  />
                </div>
                <div className={styles.info}>
                  <span className={styles.name}>{user.first_name}</span>
                  <span className={styles.age}>{user.age}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
