export default defineNuxtRouteMiddleware((to, from) => {
  // Get auth token from cookies
  const authToken = useCookie('auth_token')
  //allow access to register and login pages without auth token
  const publicPages = ['/register', '/login']
  if (publicPages.includes(to.path)) {
    return
  }
  // If no auth token, redirect to register page
  if (!authToken.value) {
    console.log('User not authenticated, redirecting to register page')
    return navigateTo('/register')
  }
})
