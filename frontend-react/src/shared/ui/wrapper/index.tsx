import React, { FC, HTMLAttributes, TouchEvent, useEffect } from "react"

import { useTelegram } from "entities/telegram/model"

import styles from "./styles.module.css"

interface WrapperProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export const Wrapper: FC<WrapperProps> = ({ children, ...props }) => {
  const { windowExpand } = useTelegram()
  const handleScroll = () => {
    console.log("awd")
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const onTouchStart = () => {
    console.log("onTouchStart")
  }

  const onTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    windowExpand()
    console.log("onTouchMove", e)
  }

  const onTouchEnd = () => {
    console.log("onTouchEnd")
  }

  return (
    <div
      autoFocus
      className={styles.wrapper}
      style={{ ...props.style }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {children}
    </div>
  )
}
