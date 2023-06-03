import { config } from "shared/config"

export interface ResponseError {
  error: string
  message: string | string[]
  statusCode: number
}

const fetcher = async <T>(input: RequestInfo, init?: RequestInit) => {
  const response = await fetch(input, init)

  if (!response.ok) {
    throw response
  }

  return response.json() as Promise<T>
}
