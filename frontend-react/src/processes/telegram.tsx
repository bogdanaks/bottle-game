import { useEffect, useState } from "react"
import { Outlet } from "react-router-dom"

import { config } from "shared/config"

const TelegramProvider = () => {
  const [hasTg, setHasTg] = useState(false)

  const windowExpand = () => {
    window.Telegram.WebApp.expand()
  }

  useEffect(() => {
    if (Object.keys(window.Telegram.WebApp.initDataUnsafe).length) {
      windowExpand()
      window.Telegram.WebApp.enableClosingConfirmation()

      setHasTg(true)
      return
    }

    if (config.TEST_MODE) {
      setHasTg(config.TEST_MODE)
    }

    return () => {
      // window.Telegram.WebApp.onEvent('viewportChanged', windowExpand)
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
