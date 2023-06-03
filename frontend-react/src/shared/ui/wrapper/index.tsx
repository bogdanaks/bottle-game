import React, { FC, HTMLAttributes } from "react"

import styles from "./styles.module.scss"

interface WrapperProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export const Wrapper: FC<WrapperProps> = ({ children, ...props }) => {
  return (
    <div className={styles.wrapper} style={{ ...props.style }}>
      {children}
    </div>
  )
}
