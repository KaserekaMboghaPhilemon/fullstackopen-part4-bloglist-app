
// Import the Express app, configuration, and logger
const app = require('./app') // the actual Express application
const config = require('./utils/config')
const logger = require('./utils/logger')

// Start the server and listen on the configured port
app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})
