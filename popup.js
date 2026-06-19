document.addEventListener('DOMContentLoaded', () => {
  const widthEl = document.getElementById('width')
  const heightEl = document.getElementById('height')
  const widthVal = document.getElementById('widthVal')
  const heightVal = document.getElementById('heightVal')
  const toggleBtn = document.getElementById('toggle')
  const statusEl = document.getElementById('status')

  let currentTabId = null

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs[0]) {
      statusEl.textContent = 'No active tab'
      return
    }
    currentTabId = tabs[0].id

    chrome.tabs.sendMessage(
      currentTabId,
      { action: 'getStatus' },
      (resp) => {
        if (chrome.runtime.lastError || !resp) {
          statusEl.textContent = 'Reload the page to activate'
          return
        }
        widthEl.value = resp.width
        heightEl.value = resp.height
        widthVal.textContent = resp.width
        heightVal.textContent = resp.height
        toggleBtn.textContent = resp.visible ? 'Hide' : 'Show'
        toggleBtn.classList.toggle('active', resp.visible)
        statusEl.textContent = resp.hasVideo
          ? 'Video detected'
          : 'No video detected'
        statusEl.className = 'note' + (resp.hasVideo ? ' ok' : '')
      }
    )
  })

  function send(action, data, cb) {
    if (!currentTabId) return
    chrome.tabs.sendMessage(currentTabId, { action, ...data }, (resp) => {
      if (chrome.runtime.lastError) return
      if (cb) cb(resp)
    })
  }

  widthEl.addEventListener('input', () => {
    const w = parseInt(widthEl.value)
    const h = parseInt(heightEl.value)
    widthVal.textContent = w
    send('resize', { width: w, height: h }, (r) => {
      if (r) {
        widthVal.textContent = r.width
        heightVal.textContent = r.height
      }
    })
  })

  heightEl.addEventListener('input', () => {
    const w = parseInt(widthEl.value)
    const h = parseInt(heightEl.value)
    heightVal.textContent = h
    send('resize', { width: w, height: h }, (r) => {
      if (r) {
        widthVal.textContent = r.width
        heightVal.textContent = r.height
      }
    })
  })

  toggleBtn.addEventListener('click', () => {
    send('toggle', {}, (resp) => {
      if (!resp) return
      toggleBtn.textContent = resp.visible ? 'Hide' : 'Show'
      toggleBtn.classList.toggle('active', resp.visible)
    })
  })
})
