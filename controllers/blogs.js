
// Import Express router and Blog model.
// User resolution is handled by userExtractor middleware, so no direct import needed.
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')


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


// POST endpoint to add a new blog (protected: requires valid token via userExtractor)
blogsRouter.post('/', async (request, response, next) => {
  try {
    // userExtractor populates request.user from the Bearer token; null means no/invalid token.
    const user = request.user
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


// DELETE endpoint to remove a single blog by id (protected: requires token + ownership)
blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    // userExtractor populates request.user; null means no/invalid token.
    const user = request.user
    if (!user) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    // Fetch the blog to verify the token user is the creator.
    const blog = await Blog.findById(request.params.id)
    if (!blog) {
      return response.status(404).end()
    }

    // Convert both IDs to strings before comparing (Mongoose ObjectId vs string).
    if (blog.user.toString() !== user._id.toString()) {
      return response.status(403).json({ error: 'unauthorized to delete this blog' })
    }

    // Delete is authorized, remove the blog document.
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
