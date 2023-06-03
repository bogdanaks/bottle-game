import assert from "assert"

assert(process.env.DB_PORT, "Env DB_PORT undefined")
assert(process.env.DB_NAME, "Env DB_NAME undefined")
assert(process.env.DB_USER, "Env DB_USER undefined")
assert(process.env.DB_PASSWORD, "Env DB_PASSWORD undefined")
assert(process.env.DB_HOST, "Env DB_HOST undefined")

export const databaseConfig = {
  port: Number(process.env.DB_PORT) || 5432,
  name: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
}
