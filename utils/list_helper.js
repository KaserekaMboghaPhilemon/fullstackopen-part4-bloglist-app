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
  return 1;
};

/**
 * Calculates the total number of likes for a list of blogs.
 * This function uses the Array reduce method to sum up the likes property of each blog object.
 *
 * @param {Array} blogs - An array of blog objects, each with a 'likes' property
 * @returns {number} The total number of likes for all blogs in the list
 */
const totalLikes = (blogs) => {
  // The reduce method goes through each blog and adds up the likes
  return blogs.reduce((sum, blog) => sum + (blog.likes || 0), 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  const favorite = blogs.reduce((best, current) => {
    return current.likes > best.likes ? current : best;
  });

  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes,
  };
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  const counts = blogs.reduce((acc, blog) => {
    acc[blog.author] = (acc[blog.author] || 0) + 1;
    return acc;
  }, {});

  const topAuthor = Object.entries(counts).reduce((best, current) => {
    return current[1] > best[1] ? current : best;
  });

  return {
    author: topAuthor[0],
    blogs: topAuthor[1],
  };
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  const likesByAuthor = blogs.reduce((acc, blog) => {
    acc[blog.author] = (acc[blog.author] || 0) + (blog.likes || 0);
    return acc;
  }, {});

  const topAuthor = Object.entries(likesByAuthor).reduce((best, current) => {
    return current[1] > best[1] ? current : best;
  });

  return {
    author: topAuthor[0],
    likes: topAuthor[1],
  };
};

// Export all helper functions from this file
module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
