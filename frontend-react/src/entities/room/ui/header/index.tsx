import { useState } from "react"
import { HiCog8Tooth } from "react-icons/hi2"

import { useAppSelector } from "app/hooks"

import { selectChat } from "entities/chat/model/slice"
import { selectLastHistory } from "entities/game/model/slice"

import { SettingsModal } from "../settings"
import styles from "./styles.module.css"

export const Header = () => {
  const { roomId } = useAppSelector(selectChat)
  const lastHistory = useAppSelector(selectLastHistory)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  const handleSettingsClick = () => {
    setIsSettingsOpen(true)
  }

  const handleCloseClick = () => {
    setIsSettingsOpen(false)
  }

  return (
    <div className={styles.tableHeader}>
      <span>Стол: {roomId}</span>
      {!lastHistory && <span>Ждëм 3-го игрока..</span>}
      <div className={styles.settingsBtn} onClick={handleSettingsClick}>
        <HiCog8Tooth />
      </div>
      {isSettingsOpen && <SettingsModal handleCloseClick={handleCloseClick} />}
    </div>
  )
}
