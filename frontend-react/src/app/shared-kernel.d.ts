type WebAppType = {
  id: string
  title: string
  slug: string
  created_at: Date
  updated_at: Date
}

type WebAppCategory = {
  id: string
  title: string
  slug: string
  created_at: Date
  updated_at: Date
}

interface TgWebApp {
  expand: () => void
  openTelegramLink: (url: string) => void
  openLink: (url: string) => void
  setHeaderColor: (rgb: string) => void
  setBackgroundColor: (rgb: string) => void
  setText: (text: string) => void
  initData: string
  initDataUnsafe: TgInitDataUnsafe
  version: string
  colorScheme: string
  themeParams: {
    bg_color: string
    secondary_bg_color: string
    button_color: string
    button_text_color: string
    hint_color: string
    link_color: string
    text_color: string
  }
  isExpanded: boolean
  viewportHeight: number
  viewportStableHeight: number
  headerColor: string
  backgroundColor: string
  BackButton: {
    isVisible: boolean
    onClick: (cb: unknown) => void
    offClick: (cb: unknown) => void
    show: () => void
    hide: () => void
  }
  MainButton: {
    text: string
    color: string
    textColor: string
    isVisible: boolean
    isProgressVisible: boolean
    isActive: boolean
    setText: (text: string) => void
    show: () => void
    hide: () => void
    onClick: (cb: unknown) => void
    offClick: (cb: unknown) => void
    setParams: (params: MainButtonParams) => void
  }
  HapticFeedback: {
    impactOccurred: (style: ImpactOccurredStyle) => void
    notificationOccurred: (type: "error" | "success" | "warning") => void
    selectionChanged: (style) => void
  }
  isClosingConfirmationEnabled: boolean
  enableClosingConfirmation: () => void
  disableClosingConfirmation: () => void
  showConfirm: (message: string, cb: unknown) => void
  showPopup: (params: PopupParams, cb: unknown) => void
  showAlert: (message: string, cb: unknown) => void
}

type ImpactOccurredStyle = "light" | "medium" | "heavy" | "rigid" | "soft"

interface TgInitDataUnsafe {
  query_id: string
  user: TgUser
  auth_date: string
  hash: string
}

interface TgUser {
  id: number
  first_name: string
  language_code: string
  last_name?: string
  is_premium?: boolean
}

interface UserEntity {
  id: number
  first_name: string
  last_name: string
  language_code: string
  is_premium: boolean
  photo_url: string
  gender: string
  age: number
  position: number
  hearts: number
}

interface TgWebView {
  callEventCallbacks: (eventType: string, func: unknown) => void
  initParams: object
  isIframe: false
  offEvent: (eventType: string, func: unknown) => void
  onEvent: (eventType: string, func: unknown) => void
  postEvent: (eventType: string, func: () => void, eventData: unknown) => void
  receiveEvent: (eventType: string, func: () => void, eventData: unknown) => void
}

type TgWebUtils = Record<string, undefined>

type PopupParams = {
  title: string
  message: string
  buttons: PopupButton[]
}

type PopupButton = {
  id: string
  type: "default" | "ok" | "close" | "cancel" | "destructive"
  text: string
}

type MainButtonParams = {
  text?: string
  color?: string
  text_color?: string
  is_active?: boolean
  is_visible?: boolean
}
