import { config } from "shared/config"
import { getTestUser } from "shared/lib/local-storage"

export interface Telegram {
  utils: TgWebUtils
  webApp: TgWebApp
  webView: TgWebView
  user: TgUser
}

export const useTelegram = () => {
  const testUser = getTestUser()
  const user: TgUser = !config.TEST_MODE
    ? window.Telegram.WebApp.initDataUnsafe.user
    : testUser
    ? testUser
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

  return {
    ...telegram,
  }
}
