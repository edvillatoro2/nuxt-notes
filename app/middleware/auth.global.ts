export default defineNuxtRouteMiddleware((to, from) => {
  if (!process.client) return
  // Check for auth token
  const authToken = useCookie('auth_token')

  //allow access to register and login pages without auth token
  const publicPages = ['/register', '/login']
  if (publicPages.includes(to.path)) {
    return
  }

  // If no auth token, redirect to register page
  if (!authToken.value) {
    return navigateTo('/register', { replace: true })
  }
})
