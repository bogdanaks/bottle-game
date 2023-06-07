import SocketProvider from "processes/socket"
import TelegramProvider from "processes/telegram"
import { FC } from "react"
import { Route, Routes } from "react-router-dom"

import InitProvider from "app/init"

import SignInPage from "pages/sign-in"

import "shared/styles/globals.css"
import "shared/styles/tailwind.css"

import MainPage from "./pages/main"

const App: FC = () => {
  return (
    <Routes>
      <Route element={<TelegramProvider />}>
        <Route element={<InitProvider />}>
          <Route element={<SocketProvider />}>
            <Route path="/" element={<MainPage />} />
          </Route>
        </Route>
        <Route path="/sign-in" element={<SignInPage />} />
      </Route>
    </Routes>
  )
}

export default App
