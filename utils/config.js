require('dotenv').config()

const PORT = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI
// Test fallback avoids undefined secret when running local tests without .env setup.
const SECRET = process.env.SECRET || 'TEST_SECRET'

module.exports = { MONGODB_URI, PORT, SECRET }