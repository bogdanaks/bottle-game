import { config } from "shared/config"
import { getTestUserId } from "shared/lib/local-storage"
import { getMockTgUser } from "shared/mock"

export interface Telegram {
  utils: TgWebUtils
  webApp: TgWebApp
  webView: TgWebView
  user: TgUser
}

export const useTelegram = () => {
  const testUserId = getTestUserId()

  const user =
    config.TEST_MODE && testUserId
      ? getMockTgUser(testUserId)
      : window.Telegram.WebApp.initDataUnsafe.user

  const telegram = {
    utils: window.Telegram.Utils,
    webApp: window.Telegram.WebApp,
    webView: window.Telegram.WebView,
    user,
    haptic: {
      impactOccurred: window.Telegram.WebApp.HapticFeedback.impactOccurred,
      notificationOccurred: window.Telegram.WebApp.HapticFeedback.notificationOccurred,
      selectionChanged: window.Telegram.WebApp.HapticFeedback.selectionChanged,
    },
  }

  const windowExpand = () => {
    window.Telegram.WebApp.expand()
  }

  return {
    ...telegram,
    windowExpand,
  }
}
