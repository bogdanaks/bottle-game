import { UserInRoom } from "@/common/types"
import { appConfig } from "@/config"

export const chooseNextPos = (chooseFromArr: UserInRoom[], currentPos: number) => {
  const i = chooseFromArr.map((i) => Number(i.position)).indexOf(currentPos) + 1
  const n = chooseFromArr.length
  return chooseFromArr[((i % n) + n) % n]
}
