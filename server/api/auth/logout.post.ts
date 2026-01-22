export default defineEventHandler(async (event) => {
  // Clear the cookie
  deleteCookie(event, 'auth_token')
  // Return success response
  return { success: true }
})
