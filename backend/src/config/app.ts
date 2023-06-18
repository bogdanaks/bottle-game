import assert from "assert"

assert(process.env.PORT, "Env PORT undefined")
assert(process.env.TG_TOKEN, "Env TG_TOKEN undefined")
assert(process.env.REDIS_HOST, "Env REDIS_HOST undefined")

export const appConfig = {
  port: Number(process.env.PORT),
  redisPort: Number(process.env.REDIS_PORT) || 6379,
  redisHost: process.env.REDIS_HOST || "",
  tgToken: process.env.TG_TOKEN || "",
  roomSize: 3,
  gameTickMs: 10000,
}
