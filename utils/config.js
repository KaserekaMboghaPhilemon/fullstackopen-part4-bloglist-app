require('dotenv').config()

const PORT = process.env.PORT

const getTestMongoUri = () => {
	if (process.env.TEST_MONGODB_URI) {
		return process.env.TEST_MONGODB_URI
	}

	if (!process.env.MONGODB_URI) {
		return undefined
	}

	return process.env.MONGODB_URI.replace(/\/([^/?]+)(\?|$)/, '/bloglist-test$2')
}

const MONGODB_URI = process.env.NODE_ENV === 'test'
	? getTestMongoUri()
	: process.env.MONGODB_URI

module.exports = { MONGODB_URI, PORT }
