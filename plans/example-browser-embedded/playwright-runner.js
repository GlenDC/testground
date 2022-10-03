const {
  chromium,
  firefox
} = require('playwright')
const testground = require('@testground/sdk')

const spawnServer = require('./server')

// create a testground testCase function
// which will open a page in a desired browser,
// with the required javascript resources loaded on it.
// The Default exported function from the given module
// will be run in that page. Please note
// the function has to be self-contained and cannot
// contain calls to other functions in that module! (TODO: confirm)
module.exports = (module) => {
  const testFn = require(module)
  return async (runenv, client) => {
    runenv.recordStart()
    await runTestFn(runenv, client, testFn)
    runenv.recordSuccess()
  }
}

// utility function to launch the desired browser,
// open a new (blank) page on it, go to the local express server
// with the required resources on it, and run the given
// function within the browser in the context of that open page.
async function runTestFn (runenv, client, fn) {
  let browser
  let result

  try {
    runenv.recordMessage('spawning local test server')
    await spawnServer(runenv, client, 8080)

    runenv.recordMessage('playwright: launching browser and opening new page')

    switch (runenv.testInstanceParams.browser || 'chromium') {
      case 'firefox':
        browser = await firefox.launch()
        runenv.recordMessage('playwright: firefox launched')
        break

      case 'chromium':
        browser = await chromium.launch()
        runenv.recordMessage('playwright: chromium launched')
        break

      default:
        throw new Error(`invalid browser test parameter: ${runenv.testInstanceParams.browser}`)
    }

    const page = await browser.newPage()
    runenv.recordMessage('playwright: new page opened')

    runenv.recordMessage('playwright: injecting process env to create testground runtime in the browser')
    page.evaluate(`
      window.testground = {
        processEnv: ${JSON.stringify(process.env)},
      }
    `)

    await page.goto('localhost:8080')
    runenv.recordMessage('playwright: opened local test page')

    runenv.recordMessage('playwright: evaluate user-defined test fn')
    await page.evaluate(fn)
    runenv.recordMessage('playwright: finished evaluating user-defined test fn')
  } finally {
    if (browser) {
      try {
        await browser.close()
        runenv.recordMessage('playwright: browser closed')
      } catch (error) {
        runenv.recordMessage(`playwright: failed to close browser: ${error}`)
      }
    }
  }

  return result
}
