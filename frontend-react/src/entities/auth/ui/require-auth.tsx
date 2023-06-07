import { Navigate, Outlet, useLocation } from "react-router-dom"

import { useAppSelector } from "app/hooks"

import { selectIsAuth } from "../model/slice"

export const RequireAuth = () => {
  const isAuth = useAppSelector(selectIsAuth)
  const location = useLocation()

  return isAuth ? <Outlet /> : <Navigate to="/sign-in" state={{ form: location }} replace />
}
