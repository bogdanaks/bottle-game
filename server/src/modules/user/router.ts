import { makeInvoker } from "awilix-express"
import { Router, Request, Response } from "express"
import { UserController } from "./controller"

const userRouter = Router()

function makeAPI({ userController }: { userController: UserController }) {
  return {
    createUser: (req: Request, res: Response) => userController.createUser(req, res),
  }
}

const api = makeInvoker(makeAPI)

userRouter.post("/", api("createUser"))

userRouter.use("/user", userRouter)
export { userRouter }
