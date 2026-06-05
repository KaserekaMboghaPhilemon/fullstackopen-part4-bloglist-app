
// Import required modules
const express = require('express')
const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')


// Create an Express application
const app = express()


// Connect to MongoDB using URI from config
logger.info('connecting to', config.MONGODB_URI)


mongoose
  .connect(config.MONGODB_URI, { family: 4 })
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message)
  })


// Middleware for serving static files and parsing JSON
app.use(express.static('dist'))

// Parse incoming request bodies before route handlers run.
app.use(express.json())
app.use(middleware.requestLogger)
// Extract token before routers so protected routes can verify request.token.
app.use(middleware.tokenExtractor)

// Register the blogs API router
app.use('/api/blogs', blogsRouter)

// Register the users API router
app.use('/api/users', usersRouter)

// Register the login API router
// Clients use this endpoint to exchange username/password for a JWT.
app.use('/api/login', loginRouter)

// Error-related middleware is registered last so it can catch route failures.
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

// Export the Express app for use in index.js
module.exports = app
