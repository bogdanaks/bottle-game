import { Request, Response } from "express"
import { UserService } from "./service"

interface UserControllerProps {
  userService: UserService
}

export class UserController {
  private userService

  constructor({ userService }: UserControllerProps) {
    this.userService = userService
  }

  async createUser(req: Request, res: Response) {
    // TODO VALIDATE

    const user = req.body
    console.log("user", user)
    // this.userService.userAdd()
    res.send("ok")
  }
}
