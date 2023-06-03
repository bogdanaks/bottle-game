interface ChatMessageUserNameProps {
  user: UserEntity
}

export const ChatMessageUserName = ({ user }: ChatMessageUserNameProps) => {
  // TODO fix color
  return (
    <span
      className={`font-medium ${
        user.gender === "M" ? "text-iblue-600" : "text-pink-600"
      } hover:underline cursor-pointer text-sm w-fit`}
    >
      {user.first_name}
    </span>
  )
}
