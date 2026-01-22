import { requiredAuth } from '../../utils/requiredAuth'

export default defineEventHandler(async (event) => {
  await requiredAuth(event)

  const userId = event.context.auth.userId

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      createdAt: true
    }
  })

  if (!user) {
    throw createError({ statusCode: 404, statusMessage: 'User not found' })
  }

  return user
})
