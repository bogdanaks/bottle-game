interface TelegramState {
  webApp: TgWebApp | null
  data: TgWebApp["initDataUnsafe"] | null
}
