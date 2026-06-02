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
})

after(async () => {
  // Close DB connection so the Node test runner can exit cleanly.
  await mongoose.connection.close()
})