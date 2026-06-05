const info = (...params) => {
  // Keep test output clean by silencing non-error logs in test environment.
  if (process.env.NODE_ENV !== 'test') {
    console.log(...params)
  }
}

const error = (...params) => {
  // Error logs are also muted in tests to avoid noisy snapshots.
  if (process.env.NODE_ENV !== 'test') {
    console.error(...params)
  }
}

module.exports = { info, error }
