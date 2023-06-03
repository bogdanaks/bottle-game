import { useEffect } from "react"

import { useLoginMutation } from "entities/auth/api"
import { useTelegram } from "entities/telegram/model"

import { Loader } from "shared/ui/loader"
import { Navigate, Outlet } from "react-router-dom"
import { useAppSelector } from "./hooks"
import { selectText } from "entities/console-alert/model/slice"

const InitProvider = () => {
  const telegram = useTelegram()
  const [login, { isLoading, data }] = useLoginMutation()
  const consoleAlert = useAppSelector(selectText)

  useEffect(() => {
    if (!telegram.user) return
    login({ id: String(telegram.user.id) })
  }, [])

  if (!telegram.user) return null

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
        A: {consoleAlert && <h3>{consoleAlert}</h3>}
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
