// tests/list_helper.test.js
//
// This file contains tests for the helper functions in utils/list_helper.js.
// Each test checks that the helper functions work as expected.
//
// These tests are designed to be clear and beginner-friendly.

const { test, describe } = require('node:test')
const assert = require('node:assert')

// Import the helper functions to be tested
const listHelper = require('../utils/list_helper')

describe('dummy', () => {
  test('dummy returns one', () => {
    // The dummy function should always return 1, regardless of input
    const blogs = []
    const result = listHelper.dummy(blogs)
    assert.strictEqual(result, 1)
  })
})
