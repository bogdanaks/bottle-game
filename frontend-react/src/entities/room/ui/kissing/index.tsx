import { motion } from "framer-motion"
import { HiHeart } from "react-icons/hi2"

import styles from "./styles.module.css"

export const Kissing = () => {
  return (
    <div className={styles.wrapper}>
      <motion.div id="heart" initial={{ x: 0, y: 0, opacity: 1 }} style={{ opacity: 1 }}>
        <HiHeart color="red" className={styles.heartIcon} />
      </motion.div>
    </div>
  )
}
