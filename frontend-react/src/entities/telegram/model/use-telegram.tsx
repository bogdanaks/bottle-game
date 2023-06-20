import { useAppSelector } from "app/hooks"

import { selectAppSettings } from "entities/user/model/slice"

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
  const { hasVibration } = useAppSelector(selectAppSettings)

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

  const impactOccurred = (style: ImpactOccurredStyle) => {
    if (!hasVibration) return
    if (telegram.webApp.version < "6.1") return
    telegram.haptic.impactOccurred(style)
  }

  const notificationOccurred = (type: "error" | "success" | "warning") => {
    if (!hasVibration) return
    if (telegram.webApp.version < "6.1") return
    telegram.haptic.notificationOccurred(type)
  }

  const selectionChanged = () => {
    if (!hasVibration) return
    if (telegram.webApp.version < "6.1") return
    telegram.haptic.selectionChanged()
  }

  return {
    ...telegram,
    windowExpand: window.Telegram.WebApp.expand(),
    impactOccurred,
    notificationOccurred,
    selectionChanged,
  }
}
