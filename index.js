
// Import the Express app, configuration, and logger
const app = require('./app') // the actual Express application
const config = require('./utils/config')
const logger = require('./utils/logger')

// Start the server and listen on the configured port
app.listen(config.PORT, () => {
  // Startup log confirms app boot and effective runtime port.
  logger.info(`Server running on port ${config.PORT}`)
})
