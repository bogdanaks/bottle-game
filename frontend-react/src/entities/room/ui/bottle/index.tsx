import { motion, useAnimate } from "framer-motion"
import { useEffect } from "react"

import { useAppSelector } from "app/hooks"

import { selectChat } from "entities/chat/model/slice"
import { selectGame } from "entities/game/model/slice"

import BottleImg from "shared/assets/images/bottle.png"

import styles from "./styles.module.css"

export const Bottle = () => {
  const [scope, animate] = useAnimate()
  const game = useAppSelector(selectGame)
  const { users } = useAppSelector(selectChat)

  useEffect(() => {
    if (!game) return
    onSpinBottle()
  }, [game])

  const onSpinBottle = () => {
    if (!game) return
    const allPoses = [0, 45, 90, 135, 180, 225, 270, 315]
    const userTo = users.find((i) => String(i.id) === String(game.user_to))

    animate(
      scope.current,
      { rotate: [0, 2160 + allPoses[Number(game.position_to) - 1]] },
      { duration: 2, ease: "easeOut", type: "tween" }
    )
  }

  return (
    <motion.div className={styles.bottle} onClick={onSpinBottle}>
      <img ref={scope} src={BottleImg} alt="Bottle" className={styles.bottleImg} />
    </motion.div>
  )
}
