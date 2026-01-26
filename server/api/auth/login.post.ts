import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ email: string; password: string }>(event)

  //validate email presence
  if (!body.email) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Please enter a valid email address.'
    })
  }

  // find user by email
  const user = await prisma.user.findUnique({
    where: {
      email: body.email
    }
  })
  //check if user exists
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid email'
    })
  }

  //verify password
  const isValidPassword = await bcrypt.compare(body.password, user.password)
  if (!isValidPassword) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid password'
    })
  }

  //create JWT token
  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET as string, {
    expiresIn: '7d'
  })

  //set cookie
  setCookie(event, 'auth_token', token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 // 7 days
  })
  return {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt
  }
})
