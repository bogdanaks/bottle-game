import { useAppSelector } from "app/hooks"

import { selectText } from "entities/console-alert/model/slice"

import styles from "./styles.module.css"

export const ConsoleInfo = () => {
  const consoleText = useAppSelector(selectText)

  return <div className={styles.wrapper}>{consoleText}</div>
}
