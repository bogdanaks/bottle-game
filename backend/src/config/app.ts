import assert from "assert"

assert(process.env.PORT, "Env PORT undefined")
assert(process.env.TG_TOKEN, "Env TG_TOKEN undefined")

export const appConfig = {
  port: Number(process.env.PORT),
  tgToken: process.env.TG_TOKEN || "",
  roomSize: 3,
  gameTickMs: 10000,
}
