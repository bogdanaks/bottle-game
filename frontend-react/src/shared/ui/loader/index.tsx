import { FC } from "react"

import styles from "./styles.module.css"

export const Loader: FC = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.loader}>
        <div />
        <div />
        <div />
        <div />
      </div>
    </div>
  )
}
