import { motion, useAnimate } from "framer-motion"
import { useEffect, useMemo, useState } from "react"
import { useCountdown } from "usehooks-ts"

import { useAppSelector } from "app/hooks"

import { selectLastHistory } from "entities/game/model/slice"
import { useTelegram } from "entities/telegram/model"

import styles from "./styles.module.css"

interface ConfirmKissProps {
  handleKissClick: () => void
}

export const ConfirmKiss = ({ handleKissClick }: ConfirmKissProps) => {
  const [isVisible, setIsVisible] = useState(true)
  const lastHistory = useAppSelector(selectLastHistory)
  const [scope, animate] = useAnimate()
  const { user } = useTelegram()
  const [count, { startCountdown, stopCountdown, resetCountdown }] = useCountdown({
    countStart: 10,
    intervalMs: 1000,
  })

  const handleKissClickWrapper = () => {
    setIsVisible(false)
    handleKissClick()
  }

  const isMe = useMemo(() => {
    if (!lastHistory) return false

    switch (lastHistory.event) {
      case "confirmationTime":
        return (
          lastHistory?.payload?.user_current?.id === String(user.id) ||
          lastHistory?.payload?.user_target?.id === String(user.id)
        )
      case "kissUser":
        return (
          lastHistory?.payload?.user_current === String(user.id) ||
          lastHistory?.payload?.user_target === String(user.id)
        )

      default:
        return false
    }
  }, [lastHistory, user.id])

  const runAnimationOpacityHide = () => {
    animate([[scope.current, { opacity: [1, 0] }, { duration: 0.4, type: "tween" }]])
  }

  const handleCancelClick = () => {
    setIsVisible(false)
  }

  const runAnimationOpacityVisible = () => {
    setIsVisible(true)
    animate([[scope.current, { opacity: [0, 1] }, { duration: 0.4, type: "tween" }]])
  }

  useEffect(() => {
    if (!lastHistory || !lastHistory.event) return

    switch (lastHistory.event) {
      case "waitingSpin":
        runAnimationOpacityHide()
        resetCountdown()
        break
      case "confirmationTime":
        runAnimationOpacityVisible()
        startCountdown()
        break

      default:
        break
    }
  }, [lastHistory])

  useEffect(() => {
    if (count === 0) {
      stopCountdown()
      resetCountdown()
    }
  }, [count])

  return (
    <motion.div className={styles.wrapper} ref={scope}>
      <div className={styles.container}>
        <h1 className={styles.title}>Поцелуются?</h1>
        <div className={styles.centerBlock} />
        {isMe && isVisible ? (
          <div className="flex flex-row items-center justify-between">
            <button
              onClick={handleCancelClick}
              className="cursor-pointer text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2"
            >
              Отказаться
            </button>
            <button
              onClick={handleKissClickWrapper}
              className="cursor-pointer text-white bg-rose-500 hover:bg-rose-700 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2"
            >
              Поцеловать
            </button>
          </div>
        ) : (
          <div style={{ height: 45 }} />
        )}
        <div className={styles.timer}>{count}</div>
      </div>
    </motion.div>
  )
}
