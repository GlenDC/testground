module.exports = `(async () => {
  await window.testground.runenv.recordMessage('success.js: test user agent')
  const userAgent = window.navigator.userAgent
  if (!/linux/i.exec(userAgent)) {
    throw new Error('unexpected linux user agent:' + userAgent)
  }

  await window.testground.runenv.recordMessage(
    'success.js: success: linux platform detected'
  )
})()`
