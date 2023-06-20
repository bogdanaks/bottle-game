import { useRoom } from "entities/room/model/use-room"

import { Bottle } from "../bottle"
import { ConfirmKiss } from "../confirm-kiss"
import { Header } from "../header"
import { Heart } from "../heart"
import { Player } from "../player"
import { UserDetails } from "../user-details"
import styles from "./styles.module.css"

export const Room = () => {
  const { scope, users, event, userDetails, handleKissClick } = useRoom()

  return (
    <div className={styles.roomWrapper}>
      <Header />
      <div className={styles.container} ref={scope}>
        {event && <ConfirmKiss handleKissClick={handleKissClick} />}
        <Bottle />
        {userDetails && <UserDetails user={userDetails} />}
        {event === "kissUser" && <Heart />}
        <ul className={styles.playersNew}>
          {Array(8)
            .fill(0)
            .map((_, index) => {
              const findUser = users.find((u) => Number(u.position) === index + 1)
              if (findUser) {
                return <Player key={index} player={findUser} />
              }
              return <li key={index} className={styles.playerNew} />
            })}
        </ul>
      </div>
    </div>
  )
}
