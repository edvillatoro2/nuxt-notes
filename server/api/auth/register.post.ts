import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ email: string; password: string }>(event)

  //validate email presence
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  if (!body.email || !emailRegex.test(body.email.trim())) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Please enter a valid email address.'
    })
  }

  //validate password presence
  if (!body.password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Password is required'
    })
  }

  //password length requirement
  if (body.password.length < 8) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Password must be at least 8 characters long'
    })
  }

  //check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: body.email }
  })

  if (existingUser) {
    throw createError({
      statusCode: 409,
      statusMessage: 'User already exists'
    })
  }

  //hash password
  const salt = await bcrypt.genSalt(10)
  const passwordHash = await bcrypt.hash(body.password, salt)

  // send to database
  const user = await prisma.user.create({
    data: {
      email: body.email,
      password: passwordHash,
      salt: salt
    }
  })
  //create JWT token
  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: '7d'
    }
  )
  //set cookie
  setCookie(event, 'auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'lax'
  })
  return {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    token: token
  }
})
