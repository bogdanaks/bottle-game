import { Navigate } from "react-router-dom"

import { useAppSelector } from "app/hooks"

import { selectIsAuth } from "entities/auth/model/slice"
import { SignInForm } from "entities/auth/ui/sign-in-form"
import { selectText } from "entities/console-alert/model/slice"

const SignInPage = () => {
  const isAuth = useAppSelector(selectIsAuth)
  const consoleAlert = useAppSelector(selectText)

  if (isAuth) return <Navigate to="/" replace />

  return (
    <div
      style={{
        height: "100vh",
        width: "100wh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 40,
        padding: 40,
      }}
    >
      <div className="flex flex-col w-2/2">
        <h2>{consoleAlert}</h2>
        <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight md:text-5xl lg:text-6xl">
          Крути <mark className="px-2 text-white bg-rose-500 rounded">целуй</mark> влюбляйся
        </h1>
        <SignInForm />
      </div>
    </div>
  )
}

export default SignInPage
