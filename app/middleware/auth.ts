export default defineNuxtRouteMiddleware(async (to, from) => {
  // Allow access to register and login pages without auth
  if (to.path === '/register' || to.path === '/login') {
    console.log('✅ Public page, allowing access')
    return
  }

  const authToken = useCookie('auth_token')

  if (!authToken.value) {
    return navigateTo('/register', { replace: true })
  }

  // Only verify JWT on server-side (JWT library needs Node.js APIs)
  if (import.meta.server) {
    try {
      const jwt = await import('jsonwebtoken')
      jwt.default.verify(authToken.value, process.env.JWT_SECRET as string)
      console.log('Token verified successfully on server')
    } catch (error) {
      console.log('Token verification failed:', error)
      authToken.value = null
      return navigateTo('/register', { replace: true })
    }
  } else {
    // On client, just check if token exists (already verified on server)
    console.log('✅ Client-side: Token exists, allowing navigation')
  }

  console.log('✅ Middleware passed')
})
