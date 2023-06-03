import { SubmitHandler, useForm } from "react-hook-form"
import { useSignInMutation } from "../api"
import { useTelegram } from "entities/telegram/model"
import { useNavigate } from "react-router-dom"

interface SignInFormData {
  gender: "M" | "W"
  age: number
}

export const SignInForm = () => {
  const { register, handleSubmit } = useForm<SignInFormData>()
  const [signIn, { isLoading }] = useSignInMutation()
  const { user } = useTelegram()
  const navigate = useNavigate()

  const onSubmit: SubmitHandler<SignInFormData> = async (data) => {
    // TODO VALIDATION
    try {
      await signIn({
        ...user,
        gender: data.gender,
        age: data.age,
      }).unwrap()
      navigate("/")
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log("err", err)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-4 mt-8">
        <label htmlFor="underline_select" className="sr-only">
          Underline select
        </label>
        <select
          {...register("gender")}
          id="underline_select"
          required
          className="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none focus:outline-none focus:ring-0 focus:border-gray-200 peer"
        >
          <option value="">Выберите пол:</option>
          <option value="M">Мужской</option>
          <option value="W">Женский</option>
        </select>
      </div>

      <div>
        <label htmlFor="underline_select" className="sr-only">
          Underline select
        </label>
        <select
          {...register("age")}
          required
          id="underline_select"
          className="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none focus:outline-none focus:ring-0 focus:border-gray-200 peer"
        >
          <option value="">Укажите возраст:</option>
          {Array(82)
            .fill(null)
            .map((_, i) => (
              <option key={i + 18} value={i + 18}>
                {i + 18}
              </option>
            ))}
        </select>
      </div>

      <button
        type="submit"
        className="w-full mt-8 text-white bg-rose-500 hover:bg-rose-600 focus:ring-4 focus:outline-none focus:ring-rose-300 font-medium rounded-lg text-base px-6 py-3.5 text-center"
      >
        {!isLoading ? "Начать игру" : "Загрузка.."}
      </button>
    </form>
  )
}
