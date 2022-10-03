const { runtime, sync, network } = require('@testground/sdk')

;(async () => {
  if (!window.testground) {
    window.testground = {}
  }

  const params = window.testground.runtimeParams || {}
  params.testFromBrowser = true

  const runenv = runtime.newRunEnv(params)
  window.testground.runenv = runenv

  const client = await sync.newBoundClient(runenv)
  window.testground.client = client

  window.testground.network = network.newClient(client, runenv)
})()
