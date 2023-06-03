import cn from "classnames"
import React, { FC, HTMLAttributes } from "react"

import styles from "./styles.module.css"

interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  type?: "default" | "primary" | "text" | "link"
}

export const Button: FC<ButtonProps> = ({ children, type = "primary", ...props }) => {
  return (
    <button {...props} className={cn(styles.button, styles[type], props.className)}>
      {children}
    </button>
  )
}
