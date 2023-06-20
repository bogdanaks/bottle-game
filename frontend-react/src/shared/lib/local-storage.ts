export const getTestUserId = () => {
  return window.localStorage.getItem("testUserId")
}

export const getAppSettings = () => {
  const appSettings = window.localStorage.getItem("appSettings")
  return appSettings ? JSON.parse(appSettings) : null
}

export const setAppSettings = (appSettings: AppSettingsLS) => {
  window.localStorage.setItem("appSettings", JSON.stringify(appSettings))
}
