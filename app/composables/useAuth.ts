import { computed } from 'vue'

export const useAuth = () => {
  const user = useState<any | null>('auth_user', () => null)
  const lastVerified = useState<number>('auth_last_verified', () => 0)

  const authToken = useCookie<string | null>('auth_token', {
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  })

  const fetchUser = async (force = false) => {
    if (!authToken.value) {
      user.value = null
      lastVerified.value = 0
      return false
    }

    const now = Date.now()

    // cache user validation for 30 seconds
    if (!force && now - lastVerified.value < 30 * 1000 && user.value) {
      return true
    }

    try {
      const res = await $fetch<{ user: any }>('/api/auth/user/me')
      user.value = res.user
      lastVerified.value = now
      return true
    } catch (error: any) {
      console.error('fetchUser error:', error)

      user.value = null
      lastVerified.value = 0

      // only clear auth on actual unauthorized response
      if (error?.status === 401) {
        authToken.value = null
      }

      return false
    }
  }

  const logout = async () => {
    try {
      await $fetch('/api/auth/logout', { method: 'POST' })
    } catch (error) {
      console.error('Logout error:', error)
    }

    user.value = null
    authToken.value = null
    lastVerified.value = 0

    await navigateTo('/login', { replace: true })
  }

  return {
    user,
    authToken,
    fetchUser,
    logout,
    isAuthenticated: computed(() => !!user.value)
  }
}
