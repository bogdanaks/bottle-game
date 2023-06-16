import { HiXMark } from "react-icons/hi2"

import { useAppDispatch } from "app/hooks"

import { setUserDetails } from "entities/chat/model/slice"

import { config } from "shared/config"

import styles from "./styles.module.css"

interface UserDetailsProps {
  user: UserEntity
}

export const UserDetails = ({ user }: UserDetailsProps) => {
  const dispatch = useAppDispatch()

  const handleCloseClick = () => {
    dispatch(setUserDetails(null))
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h2 className={styles.name}>
          {user.first_name} {user.last_name}, {user.age}
        </h2>
        <HiXMark onClick={handleCloseClick} />
      </div>
      <div className={styles.avatar}>
        <img src={`${config.API_URL}${user.photo_url}`} alt="avatar" />d
      </div>
      <span style={{ marginTop: 14 }}>Это окно в разработке.</span>
    </div>
  )
}
