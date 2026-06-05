
// Import mongoose library for MongoDB object modeling
const mongoose = require('mongoose')


// Define the schema for a blog post
const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: String,     // Author's name
  url: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
  // Reference to the user who created this blog.
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
})

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})


// Export the Blog model based on the schema
module.exports = mongoose.model('Blog', blogSchema)
