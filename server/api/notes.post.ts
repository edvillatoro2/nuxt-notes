import jwt from 'jsonwebtoken'
export default defineEventHandler(async (event) => {
  // Get token from cookies
  const token = getCookie(event, 'auth_token')

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  try {
    const secret = useRuntimeConfig().jwtSecret
    const decoded = jwt.verify(token, secret) as {
      userId: number
      email: string
    }

    // Get request body
    const body = await readBody(event)
    const { id, title, content } = body

    let note

    if (id && typeof id === 'number') {
      // Update existing note
      note = await prisma.note.update({
        where: {
          id
        },
        data: {
          title,
          content
        }
      })
    } else {
      // Create new note
      note = await prisma.note.create({
        data: {
          title,
          content,
          userId: decoded.userId
        }
      })
    }

    return {
      success: true,
      note
    }
  } catch (error) {
    console.error('Error saving note:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to save note'
    })
  }
})
