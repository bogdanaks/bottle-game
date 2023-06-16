import { useState } from "react"
import { HiCog8Tooth } from "react-icons/hi2"

import { useAppSelector } from "app/hooks"

import { selectChat } from "entities/chat/model/slice"

import { SettingsModal } from "../settings"
import styles from "./styles.module.css"

export const Header = () => {
  const { roomId } = useAppSelector(selectChat)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  const handleSettingsClick = () => {
    setIsSettingsOpen(true)
  }

  const handleCloseClick = () => {
    setIsSettingsOpen(false)
  }

  return (
    <div className={styles.tableHeader}>
      <span>Комната: {roomId}</span>
      <div className={styles.settingsBtn} onClick={handleSettingsClick}>
        <HiCog8Tooth />
      </div>
      {isSettingsOpen && <SettingsModal handleCloseClick={handleCloseClick} />}
    </div>
  )
}
