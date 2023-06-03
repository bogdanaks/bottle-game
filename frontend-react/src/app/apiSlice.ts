import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  fetchBaseQuery,
} from "@reduxjs/toolkit/dist/query/react"

import { config } from "shared/config"

const createQuery = (baseUrl: string) => {
  return fetchBaseQuery({
    baseUrl,
  })
}

export const baseQueryAuth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  const result = await baseQuery(args, api, extraOptions)

  if (result.error?.status === 403) {
    window.location.href = "/sign-in"
  }

  return result
}

export const baseQuery = createQuery(`${config.API_URL}/api/v1`)
