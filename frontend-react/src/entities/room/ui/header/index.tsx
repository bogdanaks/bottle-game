import { useState } from "react"
import { HiOutlineBellAlert, HiOutlineBellSlash, HiOutlineCog8Tooth } from "react-icons/hi2"

import { useAppDispatch, useAppSelector } from "app/hooks"

import { selectChat } from "entities/chat/model/slice"
import { selectLastHistory } from "entities/game/model/slice"
import { selectAppSettings, setAppSettings } from "entities/user/model/slice"

import { SettingsModal } from "../settings"
import styles from "./styles.module.css"

export const Header = () => {
  const dispatch = useAppDispatch()
  const { roomId } = useAppSelector(selectChat)
  const { hasVibration } = useAppSelector(selectAppSettings)
  const lastHistory = useAppSelector(selectLastHistory)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  const handleSettingsClick = () => {
    setIsSettingsOpen(true)
  }

  const handleVibrationClick = () => {
    dispatch(setAppSettings({ hasVibration: !hasVibration }))
  }

  const handleCloseClick = () => {
    setIsSettingsOpen(false)
  }

  return (
    <div className={styles.tableHeader}>
      <span>Стол: {roomId}</span>
      {!lastHistory && <span>Ждëм 3-го игрока..</span>}
      <div className={styles.settingsBtns}>
        <div className={styles.settingsBtn} onClick={handleVibrationClick}>
          {hasVibration ? <HiOutlineBellAlert /> : <HiOutlineBellSlash />}
        </div>
        <div className={styles.settingsBtn} onClick={handleSettingsClick}>
          <HiOutlineCog8Tooth />
        </div>
      </div>
      {isSettingsOpen && <SettingsModal handleCloseClick={handleCloseClick} />}
    </div>
  )
}
