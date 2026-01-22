export default defineNuxtRouteMiddleware((to, from) => {
<<<<<<< HEAD
  //allow access to register and login pages without auth token
  const publicPages = ['/register', '/login']

=======
  if (!process.client) return
  // Check for auth token
  const authToken = useCookie('auth_token')

  //allow access to register and login pages without auth token
  const publicPages = ['/register', '/login']
>>>>>>> ce1d4504fdc2bcd708e28eee17510c28ba8ad897
  if (publicPages.includes(to.path)) {
    return
  }

<<<<<<< HEAD
  // Get auth token from cookies
  const authToken = useCookie('auth_token')

  // If no auth token, redirect to register page
  if (!authToken.value) {
    console.log('User not authenticated, redirecting to register page')
=======
  // If no auth token, redirect to register page
  if (!authToken.value) {
>>>>>>> ce1d4504fdc2bcd708e28eee17510c28ba8ad897
    return navigateTo('/register', { replace: true })
  }
})
