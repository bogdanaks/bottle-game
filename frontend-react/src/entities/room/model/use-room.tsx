import { useAnimate } from "framer-motion"
import { useEffect, useState } from "react"

import { useAppDispatch, useAppSelector } from "app/hooks"

import { incrementUserHearts, selectChat, setUserPoses } from "entities/chat/model/slice"
import { useKissUserMutation } from "entities/game/api"
import { selectLastHistory } from "entities/game/model/slice"
import { useTelegram } from "entities/telegram/model"

import { leftPos, rightPos, userPositions } from "shared/config/positions"

export const useRoom = () => {
  const lastHistory = useAppSelector(selectLastHistory)
  const { users, userPoses, userDetails } = useAppSelector(selectChat)
  const [scope, animate] = useAnimate()
  const [usersConfirm, setUsersConfirm] = useState<UserEntity[]>([])
  const dispatch = useAppDispatch()
  const [kissUser] = useKissUserMutation()
  const { user: tgUser, impactOccurred } = useTelegram()

  const runResetAnimConfirmTime = () => {
    const [currentUser, targetUser] = usersConfirm
    if (!currentUser || !targetUser) return
    const currentPos = userPositions[Number(currentUser.position) - 1]
    const targetPos = userPositions[Number(targetUser.position) - 1]

    const animation = animate([
      [
        `li[id='player-pos-${currentUser.position}']`,
        currentPos,
        {
          duration: 1,
          ease: "easeOut",
          type: "tween",
        },
      ],
      [
        `li[id='player-pos-${targetUser.position}']`,
        targetPos,
        {
          duration: 1,
          ease: "easeOut",
          type: "tween",
          at: "<",
        },
      ],
    ])

    animation.then(() => {
      dispatch(
        setUserPoses({
          [String(currentUser.id)]: currentPos,
          [String(targetUser.id)]: targetPos,
        })
      )
    })
  }

  const runAnimationConfirmTime = (userCurrent: UserEntity, userTarget: UserEntity) => {
    const animation = animate([
      [
        `li[id='player-pos-${userCurrent.position}']`,
        leftPos,
        {
          duration: 1,
          ease: "easeOut",
          type: "tween",
        },
      ],
      [
        `li[id='player-pos-${userTarget.position}']`,
        rightPos,
        {
          duration: 1,
          ease: "easeOut",
          type: "tween",
          at: "<",
        },
      ],
    ])

    animation.then(() => {
      dispatch(
        setUserPoses({
          [String(userCurrent.id)]: leftPos,
          [String(userTarget.id)]: rightPos,
        })
      )
    })
  }

  const runKissAnimtation = (userCurrentId: string, userTargetId: string) => {
    // TODO has bug. Иногда анимация срабатывает не с того пользователя, если быстро кликать
    const userCurrentPosId = userPoses[userCurrentId]
    const isUserCurrentLeft = userCurrentPosId.x === leftPos.x

    const pos = isUserCurrentLeft
      ? { x: [leftPos.x, rightPos.x], y: [leftPos.y, rightPos.y] }
      : { x: [rightPos.x, leftPos.x], y: [rightPos.y, leftPos.y] }

    const animation = animate([
      ["div[id='heart']", { opacity: 1 }, { duration: 0.1, type: "tween" }],
      ["div[id='heart']", pos, { duration: 0.8, type: "tween", at: "+0.1" }],
      ["div[id='heart']", { opacity: 0 }, { duration: 0.8, type: "spring", at: "+0.2" }],
    ])

    animation.then(() => {
      dispatch(incrementUserHearts(userTargetId))
    })
  }

  const handleKissClick = () => {
    if (
      !lastHistory ||
      !lastHistory.payload ||
      !lastHistory.payload.user_current ||
      !lastHistory.payload.user_target ||
      !tgUser
    )
      return

    let userTargetId = ""
    let userCurrentId = ""
    switch (lastHistory.event) {
      case "confirmationTime":
        userTargetId = lastHistory.payload.user_target.id
        userCurrentId = lastHistory.payload.user_current.id
        break
      case "kissUser":
        userTargetId = lastHistory.payload.user_target
        userCurrentId = lastHistory.payload.user_current
        break

      default:
        break
    }
    const isImSender = String(userCurrentId) === String(tgUser.id)
    kissUser(isImSender ? userTargetId : userCurrentId)
  }

  useEffect(() => {
    if (!lastHistory || !lastHistory.event) return

    switch (lastHistory.event) {
      case "waitingSpin":
        runResetAnimConfirmTime()
        break
      case "confirmationTime":
        runAnimationConfirmTime(lastHistory.payload.user_current, lastHistory.payload.user_target)
        setUsersConfirm([lastHistory.payload.user_current, lastHistory.payload.user_target])
        break
      case "kissUser":
        impactOccurred("rigid")
        runKissAnimtation(lastHistory.payload.user_current, lastHistory.payload.user_target)
        break

      default:
        break
    }
  }, [lastHistory])

  return {
    scope,
    users,
    userDetails,
    event: lastHistory?.event,
    handleKissClick,
  }
}
