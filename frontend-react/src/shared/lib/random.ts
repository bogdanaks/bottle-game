export const getRandomPosition = (mePos: number) => {
  const allPoses = [0, 45, 90, 135, 180, 225, 270, 315]
  allPoses.splice(mePos, 1)
  return allPoses[Math.floor(Math.random() * allPoses.length)]
}
