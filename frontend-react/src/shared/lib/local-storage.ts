export const getTestUser = () => {
  const testUser = window.localStorage.getItem("testUser")
  return testUser ? JSON.parse(testUser) : null
}
