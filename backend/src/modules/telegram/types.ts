export interface GetUserPhotos {
  ok: boolean
  result: {
    total_count: number
    photos: [UserPhoto[]]
  }
}

export interface UserPhoto {
  file_id: string
  file_unique_id: string
  file_size: number
  width: number
  height: number
}

export interface GetFilePath {
  ok: boolean
  result: {
    file_id: string
    file_unique_id: string
    file_size: number
    file_path: string
  }
}
