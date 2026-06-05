
// Import Express router, Blog model, and User model
const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')
const config = require('../utils/config')


// GET endpoint to fetch all blogs
blogsRouter.get('/', async (request, response, next) => {
  try {
    // Populate creator fields so API clients receive blog + creator info in one response.
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
  } catch (error) {
    next(error)
  }
})


// POST endpoint to add a new blog
blogsRouter.post('/', async (request, response, next) => {
  try {
    // Blog creation is protected: request must carry a Bearer token.
    if (!request.token) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    // Verify token signature and extract creator id from payload.
    const decodedToken = jwt.verify(request.token, config.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    // Resolve the authenticated user so the blog is tied to the token owner.
    const user = await User.findById(decodedToken.id)
    if (!user) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    // Build a model instance so schema defaults and validation are applied.
    const blog = new Blog({ ...request.body, user: user._id })
    const result = await blog.save()

    // Maintain reverse relation: user document tracks blogs it created.
    user.blogs = user.blogs.concat(result._id)
    await user.save()

    response.status(201).json(result)
  } catch (error) {
    next(error)
  }
})


// DELETE endpoint to remove a single blog by id
blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    // Current behavior treats delete as idempotent and returns 204 for missing documents.
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

// PUT endpoint to update a single blog by id
blogsRouter.put('/:id', async (request, response, next) => {
  try {
    // Pick only supported fields so update payload stays explicit.
    const blog = {
      title: request.body.title,
      author: request.body.author,
      url: request.body.url,
      likes: request.body.likes,
    }

    // Return updated document and enforce schema validators during update.
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
      new: true,
      runValidators: true,
      context: 'query',
    })

    // If the id is valid format but not found, return 404.
    if (!updatedBlog) {
      return response.status(404).end()
    }

    response.json(updatedBlog)
  } catch (error) {
    next(error)
  }
})

// Export the router to be used in app.js
module.exports = blogsRouter
