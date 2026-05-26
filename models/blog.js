
// Import mongoose library for MongoDB object modeling
const mongoose = require('mongoose')


// Define the schema for a blog post
const blogSchema = new mongoose.Schema({
  title: String,      // Title of the blog post
  author: String,     // Author's name
  url: String,        // URL to the blog
  likes: Number,      // Number of likes
})


// Export the Blog model based on the schema
module.exports = mongoose.model('Blog', blogSchema)
