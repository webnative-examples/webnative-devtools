/**
This script is run whenever the devtools are open.
In here, we can create our panel.
*/
import browser from 'webextension-polyfill'

console.log('In devtools.js')

function handleShown(window) {
  console.log('panel is being shown', window)

  // Connect with Webnative on panel shown

  window.init()

  browser.devtools.inspectedWindow.eval(`(function() {
    if (window.navigator.connectToWebnative) {
      window.navigator.connectToWebnative('${chrome.runtime.id}')
    } else {
      console.log("connect to webanative not defined.")
    }
  })()`
  )
}

function handleHidden() {
  // Disconnect from Webnative when panel hidden (?)


  console.log('panel is being hidden')
}

/**
Create a panel, and add listeners for panel show/hide events.
*/
browser.devtools.panels.create(
  'Webnative',
  '/webnative16.png',
  '/src/devtools/panel.html'
).then((newPanel) => {
  console.log('panel created', newPanel)

  newPanel.onShown.addListener(handleShown)
  newPanel.onHidden.addListener(handleHidden)
})

export { }