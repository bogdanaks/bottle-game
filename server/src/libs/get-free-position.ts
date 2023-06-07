import { UserInRoom } from "@/common/types"
import { appConfig } from "@/config"

export const getFreePosition = (players: UserInRoom[]) => {
  if (players.length === appConfig.roomSize) return null
  const usersSort = players.sort((a, b) => Number(a.position) - Number(b.position))

  const busySlots: number[] = []
  for (let i = 0; i < appConfig.roomSize; i++) {
    const user = usersSort[i]
    if (!user) break
    if (user) {
      busySlots.push(Number(user.position))
    }
  }

  let freePos: number | null = null
  for (let i = 0; i < appConfig.roomSize; i++) {
    if (busySlots.some((bS) => bS !== i + 1)) {
      freePos = i + 1
      break
    }
  }

  return freePos
}
