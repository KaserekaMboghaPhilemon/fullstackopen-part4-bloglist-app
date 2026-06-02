
// Import Express router and Blog model
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')


// GET endpoint to fetch all blogs
blogsRouter.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog.find({})
    response.json(blogs)
  } catch (error) {
    next(error)
  }
})


// POST endpoint to add a new blog
blogsRouter.post('/', async (request, response, next) => {
  try {
    const blog = new Blog(request.body)
    const result = await blog.save()
    response.status(201).json(result)
  } catch (error) {
    next(error)
  }
})


// Export the router to be used in app.js
module.exports = blogsRouter
