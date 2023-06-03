import { PropsWithChildren } from "react"

export const Scale = ({ children }: PropsWithChildren) => {
  return <div style={{ aspectRatio: "9 / 16" }}>{children}</div>
  // return (
  //   <div style={{ height: 0, paddingBottom: "56.25%", position: "relative" }}>
  //     <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
  //       {children}
  //     </div>
  //   </div>
  // )
}
