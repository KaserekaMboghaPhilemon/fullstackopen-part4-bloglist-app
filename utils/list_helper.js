// utils/list_helper.js
//
// This file contains helper functions for working with blog lists.
// Each function is designed to be simple, reusable, and easy to test.
//
// As you progress through exercises 4.3–4.7, add more functions here.

/**
 * Dummy function that always returns 1.
 * This is a placeholder to help you get started with testing.
 * @param {Array} blogs - An array of blog objects (not used here)
 * @returns {number} Always returns 1
 */
const dummy = (blogs) => {
  return 1
}

/**
 * Calculates the total number of likes for a list of blogs.
 * This function uses the Array reduce method to sum up the likes property of each blog object.
 *
 * @param {Array} blogs - An array of blog objects, each with a 'likes' property
 * @returns {number} The total number of likes for all blogs in the list
 */
const totalLikes = (blogs) => {
  // The reduce method goes through each blog and adds up the likes
  return blogs.reduce((sum, blog) => sum + (blog.likes || 0), 0)
}

/**
 * Finds the blog with the highest number of likes.
 * Returns only title, author, and likes.
 *
 * @param {Array} blogs - An array of blog objects
 * @returns {Object|null} The favorite blog summary or null for an empty list
 */
const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const favorite = blogs.reduce((best, current) => {
    return current.likes > best.likes ? current : best
  })

  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes,
  }
}

// Export all helper functions from this file
module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
}
