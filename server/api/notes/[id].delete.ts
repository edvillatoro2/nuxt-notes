import jwt from 'jsonwebtoken'
export default defineEventHandler(async (e) => {
  //get token from cookies
  const token = getCookie(e, 'auth_token')

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  //verify token, get user info
  try {
    const secret = useRuntimeConfig().jwtSecret
    const decoded = jwt.verify(token, secret) as {
      userId: number
      email: string
    }

    // Get note ID from URL params
    const id = e.context.params?.id

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Note ID is required'
      })
    }

    //delete note by id and userId
    await prisma.note.deleteMany({
      where: {
        id: Number(id),
        userId: decoded.userId
      }
    })

    return { success: true }
  } catch (err) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete note'
    })
  }
})
