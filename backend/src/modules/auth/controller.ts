import { Request, Response } from "express"
import { AuthService } from "./service"
import { UserEntity } from "../user"

interface AuthControllerProps {
  authService: AuthService
}

export class AuthController {
  private authService

  constructor({ authService }: AuthControllerProps) {
    this.authService = authService
  }

  async login(req: Request, res: Response) {
    if (!req.body.id) {
      return res.status(400).send({ error: "id is required" })
    }

    console.log("[AuthController]: User login", req.body.id)

    const user = await this.authService.login(req.body)
    if (!user) {
      return res.status(403).send({ error: "User not registered" })
    }

    return res.send(user)
  }

  async signIn(req: Request, res: Response) {
    const { id, first_name, language_code, age, gender } = req.body as UserEntity
    if (!id || !first_name || !language_code || !age || !gender) {
      return res.status(400).send({ error: "All required" })
    }

    console.log("signIn", req.body.id)

    const newUser = await this.authService.signIn(req.body)
    return res.send(newUser)
  }
}
