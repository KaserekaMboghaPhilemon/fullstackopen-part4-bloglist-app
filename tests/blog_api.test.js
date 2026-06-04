const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')

// Supertest wraps the Express app so we can call routes directly in tests.
const api = supertest(app)

beforeEach(async () => {
  // Reset the collection so every test starts from the same known state.
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

describe('when there are initially some blogs saved', () => {
  // Basic read operations for blog resources.
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    // The API should return exactly the seed data amount.
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('the unique identifier property is named id', async () => {
    const response = await api.get('/api/blogs')

    // API should expose id and hide Mongo-specific _id.
    assert.ok(response.body[0].id)
    assert.strictEqual(response.body[0]._id, undefined)
  })

  describe('addition of a new blog', () => {
    // Creating a full blog should persist it and return 201.
    test('succeeds with valid data', async () => {
      const newBlog = {
        title: 'Async testing in Node.js',
        author: 'Test Runner',
        url: 'https://example.com/async-testing',
        likes: 9,
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

      const titles = blogsAtEnd.map((blog) => blog.title)
      assert(titles.includes('Async testing in Node.js'))
    })

    test('defaults likes to 0 if likes property is missing', async () => {
      const newBlog = {
        title: 'Blog without likes',
        author: 'Defaults Tester',
        url: 'https://example.com/no-likes',
      }

      const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      // Missing likes should fall back to schema default.
      assert.strictEqual(response.body.likes, 0)
    })

    test('fails with status code 400 if title is missing', async () => {
      const newBlog = {
        author: 'No Title Tester',
        url: 'https://example.com/no-title',
        likes: 5,
      }

      await api.post('/api/blogs').send(newBlog).expect(400)

      // Invalid create must not change persisted blog count.
      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('fails with status code 400 if url is missing', async () => {
      const newBlog = {
        title: 'Blog without url',
        author: 'No URL Tester',
        likes: 3,
      }

      await api.post('/api/blogs').send(newBlog).expect(400)

      // Invalid create must not change persisted blog count.
      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })
  })

  describe('deletion of a blog', () => {
    // Deleting an existing blog should reduce total count by one.
    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)

      // Ensure the deleted id is no longer present.
      const ids = blogsAtEnd.map((b) => b.id)
      assert(!ids.includes(blogToDelete.id))
    })

    test('fails with status code 400 if id is invalid', async () => {
      const invalidId = '5a3d5da59070081a82a3445'

      await api.delete(`/api/blogs/${invalidId}`).expect(400)
    })
  })

  describe('updating a blog', () => {
    // Most updates target likes, so verify likes can be incremented.
    test('succeeds in updating likes with valid data and id', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]

      const updatedData = {
        ...blogToUpdate,
        likes: blogToUpdate.likes + 1,
      }

      const response = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedData)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      // Response should reflect the new likes value.
      assert.strictEqual(response.body.likes, updatedData.likes)

      const blogsAtEnd = await helper.blogsInDb()
      const updatedBlog = blogsAtEnd.find((blog) => blog.id === blogToUpdate.id)
      assert(updatedBlog)
      // Database value must match the requested update.
      assert.strictEqual(updatedBlog.likes, updatedData.likes)
    })

    test('fails with status code 400 if id is invalid', async () => {
      const invalidId = '5a3d5da59070081a82a3445'
      const updatedData = {
        title: 'Updated title',
        author: 'Updated author',
        url: 'https://example.com/updated',
        likes: 12,
      }

      await api
        .put(`/api/blogs/${invalidId}`)
        .send(updatedData)
        .expect(400)
    })
  })
})

after(async () => {
  // Close DB connection so the Node test runner can exit cleanly.
  await mongoose.connection.close()
})