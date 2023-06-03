import { Router, Request, Response } from "express"
import { AuthController } from "./controller"
import { makeInvoker } from "awilix-express"

const authRouter = Router()

function makeAPI({ authController }: { authController: AuthController }) {
  return {
    login: (req: Request, res: Response) => authController.login(req, res),
    signIn: (req: Request, res: Response) => authController.signIn(req, res),
  }
}

const api = makeInvoker(makeAPI)

authRouter.post("/login", api("login"))
authRouter.post("/sign-in", api("signIn"))

authRouter.use("/auth", authRouter)
export { authRouter }
