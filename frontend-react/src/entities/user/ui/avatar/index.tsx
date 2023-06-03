import { config } from "shared/config"

import styles from "./styles.module.css"

interface UserAvatarProps {
  user: UserEntity
}

export const UserAvatar = ({ user }: UserAvatarProps) => {
  return (
    <img
      className={styles.img}
      src={`${config.API_URL}${user.photo_url}`}
      alt={user.photo_url}
      width={32}
      height={32}
    />
  )
}
