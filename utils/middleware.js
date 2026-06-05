const jwt = require('jsonwebtoken')
const User = require('../models/user')
const config = require('./config')
const logger = require('./logger')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const tokenExtractor = (request, response, next) => {
  // Parse Authorization header once and expose token to all downstream handlers.
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '')
  } else {
    request.token = null
  }
  next()
}

const userExtractor = async (request, response, next) => {
  // Only resolve user when a token is present; routes that require a user
  // will return 401 themselves if request.user ends up null.
  if (!request.token) {
    request.user = null
    return next()
  }

  try {
    // Decode token to get user id, then fetch the full user document.
    const decodedToken = jwt.verify(request.token, config.SECRET)
    request.user = await User.findById(decodedToken.id)
  } catch {
    // Invalid/expired token - let the route handler or errorHandler respond.
    request.user = null
  }

  next()
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    // Use one consistent auth error for missing, malformed, or expired tokens.
    return response.status(401).json({ error: 'token missing or invalid' })
  } else if (error.name === 'MongoServerError' && error.code === 11000) {
    return response.status(400).json({ error: 'expected `username` to be unique' })
  }

  next(error)
}

module.exports = {
  requestLogger,
  tokenExtractor,
  userExtractor,
  unknownEndpoint,
  errorHandler
}
