import jwt from 'jsonwebtoken'
export function requireAuth(event: any) {
  // get token from cookies
  const token = getCookie(event, 'auth_token')

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  // verify token, get user info
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string
      email: string
    }
    return decoded
  } catch (err) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid token'
    })
  }
}
