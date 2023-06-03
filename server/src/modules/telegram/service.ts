import { appConfig } from "@/config/index"
import fs from "fs"
import { GetFilePath, GetUserPhotos } from "./types"
import axios from "axios"
import * as stream from "stream"
import { promisify } from "util"
import path from "path"

const finished = promisify(stream.finished)

export class TelegramService {
  constructor() {}

  async getUserPhoto(user_id: string) {
    try {
      const { data } = await axios.post<GetUserPhotos>(
        `https://api.telegram.org/bot${appConfig.tgToken}/getUserProfilePhotos`,
        { user_id, limit: 1 }
      )
      if (!data.result.total_count) {
        return null
      }

      const filePath = await this.getFilePath(data.result.photos[0][0].file_id)
      if (!filePath) return

      return filePath
    } catch (error) {
      console.error("Error:", error)
    }
  }

  async getFilePath(file_id: string) {
    try {
      const { data } = await axios.post<GetFilePath>(
        `https://api.telegram.org/bot${appConfig.tgToken}/getFile`,
        { file_id }
      )
      if (!data.ok) {
        return null
      }

      return data.result.file_path
    } catch (error) {
      console.error("Error:", error)
    }
  }

  async saveUserPhoto(file_path: string, user_id: string) {
    try {
      const route = path.join(__dirname, `../../../static/photos/${user_id}.jpg`) // TODO FIX IT
      const writer = fs.createWriteStream(route)

      return axios({
        method: "get",
        url: `https://api.telegram.org/file/bot${appConfig.tgToken}/${file_path}`,
        responseType: "stream",
      }).then((response) => {
        response.data.pipe(writer)
        return finished(writer)
      })
    } catch (error) {
      console.error("Error:", error)
    }
  }
}
