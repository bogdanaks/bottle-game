import { HiXMark } from "react-icons/hi2"

import styles from "./styles.module.css"

interface SettingsModalProps {
  handleCloseClick: () => void
}

export const SettingsModal = ({ handleCloseClick }: SettingsModalProps) => {
  const handleChangeRoomClick = () => {
    // TODO: implement
  }

  const handleSendSupportClick = () => {
    window.open("https://t.me/bogdanaks", "_blank")
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h2 className={styles.title}>Настройки</h2>
        <HiXMark onClick={handleCloseClick} />
      </div>
      <div className={styles.col}>
        <button
          onClick={handleChangeRoomClick}
          className="cursor-pointer text-white bg-rose-500 hover:bg-rose-700 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2"
        >
          Сменить стол
        </button>
        <button
          onClick={handleSendSupportClick}
          className="cursor-pointer text-white bg-rose-500 hover:bg-rose-700 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2"
        >
          Написать в тех. поддержку
        </button>
      </div>
      <span className="text-sm mt-4">v0.0.1 - beta</span>
    </div>
  )
}
