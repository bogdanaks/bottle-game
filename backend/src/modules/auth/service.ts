import { UserService } from "../user"
import { TgUser } from "@/common/types"

interface AuthServiceProps {
  userService: UserService
}

export class AuthService {
  protected userService

  constructor({ userService }: AuthServiceProps) {
    this.userService = userService
  }

  async login({ id }: { id: string }) {
    return await this.userService.getUserById(id)
  }

  async signIn(user: TgUser) {
    return await this.userService.userAdd(user)
  }
}
