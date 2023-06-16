import { UserEntityWithPosition } from "@/common/types"

export const chooseNextPos = (chooseFromArr: UserEntityWithPosition[], currentPos: number) => {
  const i = chooseFromArr.map((i) => Number(i.position)).indexOf(currentPos) + 1
  const n = chooseFromArr.length
  return chooseFromArr[((i % n) + n) % n]
}
