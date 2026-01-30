import jwt from 'jsonwebtoken'
export default defineEventHandler(async (event) => {
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
    const secret = useRuntimeConfig().jwtSecret
    const decoded = jwt.verify(token, secret) as {
      userId: number
      email: string
    }
    // get authenticated user's notes
    const notes = await prisma.note.findMany({
      where: {
        // filter by userId from token
        userId: decoded.userId
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })
    return {
      success: true,
      notes
    }
  } catch (err) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid token'
    })
  }
})
