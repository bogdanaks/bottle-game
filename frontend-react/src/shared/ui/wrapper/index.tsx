import React, { FC, HTMLAttributes } from "react"

import { useTelegram } from "entities/telegram/model"

import styles from "./styles.module.css"

interface WrapperProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export const Wrapper: FC<WrapperProps> = ({ children, ...props }) => {
  const { webApp } = useTelegram()

  return (
    <div
      autoFocus
      className={styles.wrapper}
      style={{ ...props.style, height: webApp.viewportHeight }}
    >
      {children}
    </div>
  )
}
