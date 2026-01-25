<<<<<<< HEAD
export default defineEventHandler(async (event) => {
  // Clear the cookie
  deleteCookie(event, 'auth_token')
  // Return success response
=======
export default defineEventHandler((event) => {
  deleteCookie(event, 'auth_token', {
    path: '/'
  })

>>>>>>> dbd522f (working token on SSR and CSR)
  return { success: true }
})
