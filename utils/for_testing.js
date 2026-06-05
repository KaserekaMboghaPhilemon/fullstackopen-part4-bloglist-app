const reverse = (string) => {
  // Split -> reverse -> join is the simplest deterministic string reversal.
  return string
    .split('')
    .reverse()
    .join('')
}

const average = (array) => {
  // Small reducer to keep average calculation reusable and testable.
  const reducer = (sum, item) => {
    return sum + item
  }

  // Empty input is defined as 0 to avoid division by zero.
  return array.length === 0
    ? 0
    : array.reduce(reducer, 0) / array.length
}

module.exports = {
  reverse,
  average,
}
