import assert from "assert"

assert(process.env.TG_TOKEN, "Env process.env.TG_TOKEN undefined")

export const config = {
  token: process.env.TG_TOKEN,
}
