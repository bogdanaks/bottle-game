import { motion } from "framer-motion"
import { useEffect } from "react"
import { HiHeart } from "react-icons/hi2"

import { useAppDispatch } from "app/hooks"

import { setUserDetails, setUserPoses } from "entities/chat/model/slice"

import { config } from "shared/config"
import { userPositions } from "shared/config/positions"

import styles from "./styles.module.css"

interface PlayerNewProps {
  player: UserEntity
}

export const Player = ({ player }: PlayerNewProps) => {
  const playerPosition = userPositions[Number(player.position) - 1]
  const dispatch = useAppDispatch()

  const handleUserClick = () => {
    dispatch(setUserDetails(player))
  }

  useEffect(() => {
    const pos: UserPose = playerPosition
    dispatch(setUserPoses({ [String(player.id)]: pos }))
  }, [])

  return (
    <motion.li
      id={`player-pos-${player.position}`}
      className={styles.player}
      initial={playerPosition}
    >
      <div className={styles.playerInner} onClick={handleUserClick}>
        <div className={styles.playerImageBox}>
          <img src={`${config.API_URL}${player.photo_url}`} alt="Player" className={styles.image} />
          {!!player.hearts && (
            <span className={styles.heart}>
              <span className={styles.counter}>{player.hearts}</span>
              <HiHeart color="red" />
            </span>
          )}
        </div>
        <div className={styles.info}>
          <span className={styles.name}>{player.first_name}</span>
          <span className={styles.age}>{player.age}</span>
        </div>
      </div>
    </motion.li>
  )
}
