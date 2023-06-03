export const config = {
  API_URL: process.env.REACT_APP_API_URL || "",
  TEST_MODE: Boolean(process.env.REACT_APP_TEST_MODE) || false,
}
