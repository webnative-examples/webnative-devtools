let panelPort, csPort

console.log(`In background.js`)

function injector(tabId) {
  console.log(`Attempting to inject content script.`)

  chrome.scripting.executeScript({
      target: { tabId },
      files: ['/src/content/content.js'],
  })
}

function panelHandler(data) {
  console.log('panelHandler', data)
  if (data.type === 'inject') {
    injector(data.tabId)
  }
  else if (data.type === 'counter') {
    if (csPort) {
      // relay the event to the content script
      csPort.postMessage(data)
    }
  }
}

function csHandler(data) {
  // console.log(`csHandler`, data)
  panelPort.postMessage(data);
}

/**
 * Set up port communications from the content script to the panel page and back again
 */
function connectionListener(port) {

  console.log(`connection from ${port.name}`);

  if (port.name === 'devtools-panel') {
    // handle  requests from the panel
    panelPort = port;
    panelPort.onMessage.addListener(panelHandler)
  }
  else if (port.name == 'content-script') {
    csPort = port;
    console.log('cs port', port)
    csPort.onMessage.addListener(csHandler)
  }
}

chrome.runtime.onConnect.addListener(connectionListener);

/**
 * Listen for messages from the content script
 */
chrome.runtime.onMessage.addListener(message => {
  // console.log('message in background script', message)
  panelPort.postMessage(message)
})

// function pageMessageHandler(message) {
//   // console.log(`pageMessageHandler: got a message in the content script`, message)
//   panelPort.postMessage(message)
// }