import { motion, useAnimate } from "framer-motion"
import { useEffect, useState } from "react"
import { useCountdown } from "usehooks-ts"

import { useAppSelector } from "app/hooks"

import { useSpinBottleMutation } from "entities/game/api"
import { selectLastHistory } from "entities/game/model/slice"
import { useTelegram } from "entities/telegram/model"

import BottleImg from "shared/assets/images/bottle.png"

import styles from "./styles.module.css"

export const Bottle = () => {
  const lastHistory = useAppSelector(selectLastHistory)
  const { user } = useTelegram()
  const [scope, animate] = useAnimate()
  const [isShowText, setIsShowText] = useState(false)
  const [emitSpinBottle] = useSpinBottleMutation()
  const [count, { startCountdown, resetCountdown }] = useCountdown({
    countStart: 5,
    intervalMs: 1000,
  })

  const isMe = lastHistory?.payload?.user?.id === String(user.id)

  const runAnimateSpin = (stopIndex?: number, duration = 2) => {
    setIsShowText(true)

    const allPoses = [0, 45, 90, 135, 180, 225, 270, 315]
    const animation = animate(
      scope.current,
      { rotate: [0, 360 * 6 + (stopIndex ? allPoses[stopIndex] : 0)] },
      { duration, type: "tween" }
    )
    animation.then(() => {
      setIsShowText(false)
      // dispatch(setLocal({ isShowConfirmKiss: true }))
    })
  }

  const runAnimationOpacityHide = () => {
    const animation = animate(scope.current, { opacity: [1, 0] }, { duration: 1, type: "tween" })
    animation.then(() => {
      // dispatch(setLocal({ isShowConfirmKiss: true }))
    })
  }

  const runAnimationOpacityVisible = () => {
    const animation = animate(scope.current, { opacity: [0, 1] }, { duration: 0.4, type: "tween" })
    animation.then(() => {
      // dispatch(setLocal({ isShowConfirmKiss: true }))
    })
  }

  const onSpinBottle = async () => {
    if (!isMe || lastHistory.event !== "waitingSpin" || isShowText) return
    runAnimateSpin()
    emitSpinBottle(lastHistory.payload.jobId)
  }

  useEffect(() => {
    if (!lastHistory || lastHistory.event !== "waitingSpin") return
    runAnimationOpacityVisible()
    resetCountdown()
    startCountdown()
  }, [lastHistory])

  useEffect(() => {
    if (!lastHistory || lastHistory.event !== "userSpinBottle") return
    runAnimateSpin(Number(lastHistory.payload.user_target.position) - 1, 3)
  }, [lastHistory])

  useEffect(() => {
    if (!lastHistory || lastHistory.event !== "confirmationTime") return
    runAnimationOpacityHide()
  }, [lastHistory])

  if (!lastHistory) return null

  return (
    <>
      {lastHistory.event === "waitingSpin" && isMe && !isShowText && (
        <span className={styles.bottleText}>Крути бутылку! {count}</span>
      )}
      <motion.div className={styles.bottle} onClick={onSpinBottle} ref={scope}>
        <img src={BottleImg} alt="Bottle" className={styles.bottleImg} />
      </motion.div>
    </>
  )
}
