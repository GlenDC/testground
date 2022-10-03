const { runtime, sync, network } = require('@testground/sdk')

(() => {
    const params = window.testground.runtimeParams
    const runenv = runtime.newRunEnv(params)
    window.testground.runenv = runenv

    const client = sync.newBoundClient(runenv)
    window.testground.client = client

    window.testground.network = network.newClient(client, runenv)
})()
