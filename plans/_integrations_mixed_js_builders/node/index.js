const { invokeMap } = require('@testground/sdk')

const testCases = {
  mixedBuilders: require('./mixed-builders'),
}

;(async () => {
  // This is the plan entry point.
  await invokeMap(testCases)
})()
