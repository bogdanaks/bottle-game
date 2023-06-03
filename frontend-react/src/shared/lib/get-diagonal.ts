export const getDiagonal = () => {
  const w = window.outerWidth
  const h = window.outerHeight
  const d = Math.sqrt(w * w + h * h)
  return Math.ceil(d)
}
