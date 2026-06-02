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

    assert.ok(response.body[0].id)
    assert.strictEqual(response.body[0]._id, undefined)
  })

  describe('addition of a new blog', () => {
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
  })
})

after(async () => {
  // Close DB connection so the Node test runner can exit cleanly.
  await mongoose.connection.close()
})