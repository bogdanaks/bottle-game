import classNames from "classnames"

import { useAppSelector } from "app/hooks"

import { selectGame } from "entities/game/model/slice"

import { config } from "shared/config"

import styles from "./styles.module.css"

interface PlayerProps {
  player: UserEntity
}

export const Player = ({ player }: PlayerProps) => {
  const game = useAppSelector(selectGame)

  return (
    <li className={styles.player}>
      <div
        className={classNames(styles.playerInner, {
          [styles.active]: game?.user_from === String(player.id),
        })}
      >
        <div className={styles.playerImageBox}>
          <img src={`${config.API_URL}${player.photo_url}`} alt="Player" className={styles.image} />
        </div>
        <div className={styles.info}>
          <span className={styles.name}>{player.first_name}</span>
          <span className={styles.age}>{player.age}</span>
        </div>
      </div>
    </li>
  )
}
