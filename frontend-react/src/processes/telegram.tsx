import { useEffect, useState } from "react"
import { Outlet } from "react-router-dom"

import { config } from "shared/config"

const TelegramProvider = () => {
  const [hasTg, setHasTg] = useState(false)

  useEffect(() => {
    if (Object.keys(window.Telegram.WebApp.initDataUnsafe).length) {
      window.Telegram.WebApp.expand()
      window.Telegram.WebApp.enableClosingConfirmation()
      setHasTg(true)
      return
    }

    console.log("TEST_MODE", config.TEST_MODE)
    if (config.TEST_MODE) {
      setHasTg(config.TEST_MODE)
    }
  }, [])

  if (!hasTg) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1>Telegram isnt connect :(</h1>
      </div>
    )
  }

  return <Outlet />
}
export default TelegramProvider
