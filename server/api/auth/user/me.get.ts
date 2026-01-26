import jwt from 'jsonwebtoken'

export default defineEventHandler((event) => {
  const token = getCookie(event, 'auth_token')
  const config = useRuntimeConfig()

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Not authenticated'
    })
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as {
      userId: string
      email: string
    }

    return {
      user: decoded
    }
  } catch {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid token'
    })
  }
})
