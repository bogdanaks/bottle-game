import { FetchBaseQueryError, createApi } from "@reduxjs/toolkit/dist/query/react"
import { baseQueryAuth } from "app/apiSlice"
import { setAuth } from "../model/slice"
import { setText } from "entities/console-alert/model/slice"

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryAuth,
  endpoints: (builder) => ({
    login: builder.mutation<UserEntity, { id: string }>({
      query: ({ id }) => ({
        url: "/auth/login",
        method: "POST",
        body: {
          id,
        },
      }),
      async onQueryStarted(args, { queryFulfilled, dispatch }) {
        try {
          await queryFulfilled
          dispatch(setText("success"))
          dispatch(setAuth(true))
        } catch (err) {
          const error = err as FetchBaseQueryError
          console.error(error)
          dispatch(setText(JSON.stringify(error)))
        }
      },
    }),
    signIn: builder.mutation<UserEntity, SignInBody>({
      query: (body) => ({
        url: "/auth/sign-in",
        method: "POST",
        body,
      }),
      async onQueryStarted(args, { queryFulfilled, dispatch }) {
        try {
          await queryFulfilled
          dispatch(setAuth(true))
        } catch (error) {
          console.error(error)
        }
      },
    }),
  }),
})

export const { useLoginMutation, useSignInMutation } = authApi
