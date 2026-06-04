const mongoose = require('mongoose')

// Usernames are persisted, while passwords are stored only as hashes.
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
  },
  name: String,
  passwordHash: String,
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    // Normalize MongoDB fields for API clients and hide sensitive data.
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  },
})

module.exports = mongoose.model('User', userSchema)
