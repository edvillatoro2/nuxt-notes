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
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
<<<<<<< HEAD
      userId: string
=======
      id: string
>>>>>>> dbd522f (working token on SSR and CSR)
      email: string
    }
    // get authenticated user's notes
    const notes = await prisma.note.findMany({
      where: {
        // filter by userId from token
<<<<<<< HEAD
        userId: decoded.userId
=======
        userId: decoded.id
>>>>>>> dbd522f (working token on SSR and CSR)
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })
    return notes
  } catch (err) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid token'
    })
  }
})
