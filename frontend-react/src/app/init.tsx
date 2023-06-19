import { useEffect } from "react"
import { Navigate, Outlet } from "react-router-dom"

import { useLoginMutation } from "entities/auth/api"
import { useTelegram } from "entities/telegram/model"

import { Loader } from "shared/ui/loader"

const InitProvider = () => {
  const telegram = useTelegram()
  const [login, { isLoading, data }] = useLoginMutation()

  useEffect(() => {
    if (!telegram.user) return
    login({ id: String(telegram.user.id) })
  }, [])

  if (!telegram.user) {
    return (
      <div
        style={{
          height: "100vh",
          width: "100wh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Telegram user not found
      </div>
    )
  }

  if (!data || isLoading) {
    return (
      <div
        style={{
          height: "100vh",
          width: "100wh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Loader />
      </div>
    )
  }

  return !isLoading && data ? (
    <Outlet />
  ) : (
    <Navigate to="/sign-in" state={{ form: location }} replace />
  )
}

export default InitProvider
