module.exports = `(async () => {
  await window.testground.runenv.recordMessage('failure.js: test user agent')
  const userAgent = window.navigator.userAgent
  if (userAgent !== 'testground') {
    throw new Error('failure.js: If you see this message, that means the test failed as expected. User agent is ' + userAgent)
  }
  window.testground.runenv.recordMessage(
    'failure.js: If you see this message, something bad has occurred - this test is meant to fail'
  )
})()`
