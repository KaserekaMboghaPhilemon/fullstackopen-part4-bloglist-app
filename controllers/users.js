const usersRouter = require('express').Router()
const bcrypt = require('bcryptjs')
const User = require('../models/user')

// List all users through the API-safe JSON transform from the model.
usersRouter.get('/', async (request, response, next) => {
  try {
    // Populate blog refs so each user response includes their created blog summaries.
    const users = await User.find({}).populate('blogs', { title: 1, url: 1 })
    response.json(users)
  } catch (error) {
    next(error)
  }
})

usersRouter.post('/', async (request, response, next) => {
  try {
    const { username, name, password } = request.body

    // Validate plaintext password before hashing; passwordHash validation cannot do this.
    if (!username) {
      return response.status(400).json({ error: 'username is required' })
    }

    if (username.length < 3) {
      return response.status(400).json({ error: 'username must be at least 3 characters long' })
    }

    if (!password) {
      return response.status(400).json({ error: 'password is required' })
    }

    if (password.length < 3) {
      return response.status(400).json({ error: 'password must be at least 3 characters long' })
    }

    // Hash password before saving so plaintext credentials never hit the database.
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    // Store only the hash so raw passwords never reach the database.
    const user = new User({
      username,
      name,
      passwordHash,
    })

    const savedUser = await user.save()
    response.status(201).json(savedUser)
  } catch (error) {
    next(error)
  }
})

module.exports = usersRouter
