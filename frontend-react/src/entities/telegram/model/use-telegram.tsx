import { config } from "shared/config"
import { getMockTgUser, getgUserLocalStorage } from "shared/mock"

export interface Telegram {
  utils: TgWebUtils
  webApp: TgWebApp
  webView: TgWebView
  user: TgUser
}

export const useTelegram = () => {
  const telegram = {
    utils: window.Telegram.Utils,
    webApp: window.Telegram.WebApp,
    webView: window.Telegram.WebView,
    // user: !config.TEST_MODE
    //   ? window.Telegram.WebApp.initDataUnsafe.user
    //   : getMockTgUser(getgUserLocalStorage()).user,
    user: window.Telegram.WebApp.initDataUnsafe.user,
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
