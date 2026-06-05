const loginRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../models/user')
const config = require('../utils/config')

// Login issues a JWT used to authenticate protected blog operations.
loginRouter.post('/', async (request, response, next) => {
  try {
    const { username, password } = request.body

    // Resolve user by username and verify plaintext password against stored hash.
    const user = await User.findOne({ username })
    const passwordCorrect = user === null
      ? false
      : await bcrypt.compare(password, user.passwordHash)

    if (!(user && passwordCorrect)) {
      return response.status(401).json({ error: 'invalid username or password' })
    }

    // Keep token payload minimal: identity only, no sensitive fields.
    const userForToken = {
      username: user.username,
      id: user._id,
    }

    // JWT payload contains minimal identity needed for protected operations.
    const token = jwt.sign(userForToken, config.SECRET)

    // Client stores this token and sends it as Bearer <token> on protected requests.
    response
      .status(200)
      .send({ token, username: user.username, name: user.name })
  } catch (error) {
    next(error)
  }
})

module.exports = loginRouter
