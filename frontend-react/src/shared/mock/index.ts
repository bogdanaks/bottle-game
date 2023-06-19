export const mockUserData = {
  query_id: "AAGc6AYzAAAAAJzoBjOa-6Y_",
  user: {
    id: 856090780,
    first_name: "Bogdan",
    last_name: "A",
    username: "bogdanaks",
    language_code: "ru",
    is_premium: true,
  },
  auth_date: "1656771179",
  hash: "8ac4765d56b0f95932b2a129c0729647e86cc0d3c9a375c768e4e9dcaff352f9",
}

export const mockUserData2 = {
  query_id: "AAGc6AYzAAAAAJzoBjOa-6Y_",
  user: {
    id: 856090777,
    first_name: "Oleg",
    last_name: "A",
    username: "bogdanaks",
    language_code: "ru",
    is_premium: true,
  },
  auth_date: "1656771179",
  hash: "8ac4765d56b0f95932b2a129c0729647e86cc0d3c9a375c768e4e9dcaff352f9",
}

export const mockUserData3 = {
  query_id: "AAGc6AYzAAAAAJzoBjOa-6Y_",
  user: {
    id: 856090666,
    first_name: "Ivan",
    last_name: "A",
    username: "bogdanaks",
    language_code: "ru",
    is_premium: true,
  },
  auth_date: "1656771179",
  hash: "8ac4765d56b0f95932b2a129c0729647e86cc0d3c9a375c768e4e9dcaff352f9",
}

export const mockUserData4 = {
  query_id: "AAGc6AYzAAAAAJzoBjOa-6Y_",
  user: {
    id: 856090555,
    first_name: "Petr",
    last_name: "A",
    username: "bogdanaks",
    language_code: "ru",
    is_premium: true,
  },
  auth_date: "1656771179",
  hash: "8ac4765d56b0f95932b2a129c0729647e86cc0d3c9a375c768e4e9dcaff352f9",
}

export const getMockTgUser = (userId: string) => {
  if (userId === "856090777") return mockUserData2
  if (userId === "856090666") return mockUserData3
  if (userId === "856090555") return mockUserData4

  return mockUserData
}

const mockUserEntity = {
  id: 856090780,
  first_name: "Bogdan",
  last_name: "A",
  language_code: "ru",
  is_premium: true,
  photo_url: "/photos/856090780.jpg",
  gender: "M",
  age: 18,
  position: 1,
  created_at: "2023-05-27T02:06:01.507Z",
  updated_at: "2023-05-27T02:06:01.507Z",
  hearts: 3,
}

export const mockMessage: ChatMessage = {
  created_at: Date.now(),
  user: mockUserEntity,
  reply_id: null,
  reply: null,
  message: "Mock message",
}
