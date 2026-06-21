(function () {
  'use strict'

  let overlay = null
  let resizeHandle = null
  let isDragging = false
  let isResizing = false
  let dragStartX, dragStartY, dragStartLeft, dragStartTop
  let resizeStartX, resizeStartY, resizeStartW, resizeStartH
  let settings = { width: 500, height: 80, visible: true }
  let pos = { bottom: 50 }
  let inFullscreen = false
  const clipped = { top: false, right: false, bottom: false, left: false }
  let isHovering = false

  function init() {
    chrome.storage.sync.get(
      { width: 500, height: 80, visible: true },
      (items) => {
        settings.width = items.width
        settings.height = items.height
        settings.visible = items.visible

        if (detectVideo()) {
          ensureOverlay()
          if (settings.visible) show()
          else hide()
        }

        observePage()
      }
    )

    document.addEventListener('fullscreenchange', onFullscreenChange)
    document.addEventListener('webkitfullscreenchange', onFullscreenChange)
    chrome.runtime.onMessage.addListener(onMessage)
  }

  function detectVideo() {
    return (
      document.querySelectorAll('video, embed[type*="flash"], object[type*="flash"]')
        .length > 0
    )
  }

  function observePage() {
    if (!document.body) {
      requestAnimationFrame(observePage)
      return
    }
    const observer = new MutationObserver(() => {
      if (detectVideo() && !overlay) {
        ensureOverlay()
        if (settings.visible) show()
      }
    })
    observer.observe(document.body, { childList: true, subtree: true })
  }

  function ensureOverlay() {
    if (overlay) return
    createOverlay()
  }

  function createOverlay() {
    overlay = document.createElement('div')
    overlay.id = 'subtitle-blocker-overlay'

    overlay.style.cssText =
      'position:fixed;background:transparent;z-index:2147483647;cursor:move;' +
      'box-sizing:border-box;user-select:none;touch-action:none;' +
      'width:' + settings.width + 'px;height:' + settings.height + 'px;' +
      'bottom:' + (pos.bottom || 50) + 'px;left:50%;transform:translateX(-50%);' +
      'display:' + (settings.visible ? 'block' : 'none')

    var quadrants = [
      { key: 'tl', style: 'top:0;left:0;width:50%;height:50%;' },
      { key: 'tr', style: 'top:0;right:0;width:50%;height:50%;' },
      { key: 'bl', style: 'bottom:0;left:0;width:50%;height:50%;' },
      { key: 'br', style: 'bottom:0;right:0;width:50%;height:50%;' },
    ]
    quadrants.forEach(function (q) {
      var div = document.createElement('div')
      div.className = 'subtitle-quadrant'
      div.dataset.quadrant = q.key
      div.style.cssText =
        'position:absolute;background:#000;pointer-events:none;' + q.style
      overlay.appendChild(div)
    })

    resizeHandle = document.createElement('div')
    resizeHandle.style.cssText =
      'position:absolute;right:0;bottom:0;width:16px;height:16px;' +
      'cursor:nwse-resize;background:linear-gradient(135deg,transparent 50%,#555 50%);' +
      'z-index:1'

    overlay.appendChild(resizeHandle)
    document.body.appendChild(overlay)

    overlay.addEventListener('mousedown', onDragStart)
    resizeHandle.addEventListener('mousedown', onResizeStart)
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
    overlay.addEventListener('mouseenter', function () { isHovering = true })
    overlay.addEventListener('mouseleave', function () { isHovering = false })
    document.addEventListener('keydown', onKeyDown)
  }

  function onDragStart(e) {
    if (e.target === resizeHandle) return
    isDragging = true
    const r = overlay.getBoundingClientRect()
    dragStartX = e.clientX
    dragStartY = e.clientY
    dragStartLeft = r.left
    dragStartTop = r.top

    overlay.style.top = r.top + 'px'
    overlay.style.bottom = 'auto'
    overlay.style.left = r.left + 'px'
    overlay.style.transform = 'none'

    e.preventDefault()
  }

  function onResizeStart(e) {
    isResizing = true
    resizeStartX = e.clientX
    resizeStartY = e.clientY
    resizeStartW = overlay.offsetWidth
    resizeStartH = overlay.offsetHeight
    e.preventDefault()
    e.stopPropagation()
  }

  function onMouseMove(e) {
    if (isDragging) {
      overlay.style.left = dragStartLeft + e.clientX - dragStartX + 'px'
      overlay.style.top = dragStartTop + e.clientY - dragStartY + 'px'
    }
    if (isResizing) {
      const w = Math.max(50, resizeStartW + e.clientX - resizeStartX)
      const h = Math.max(20, resizeStartH + e.clientY - resizeStartY)
      overlay.style.width = w + 'px'
      overlay.style.height = h + 'px'
      settings.width = w
      settings.height = h
    }
  }

  function onMouseUp() {
    if (isDragging) {
      isDragging = false
      const r = overlay.getBoundingClientRect()
      pos.top = r.top
      pos.left = r.left
    }
    if (isResizing) {
      isResizing = false
      chrome.storage.sync.set({ width: settings.width, height: settings.height })
    }
  }

  function updateOpacity() {
    if (!overlay) return
    const q = overlay.querySelectorAll('.subtitle-quadrant')
    const opacities = {
      tl: clipped.top || clipped.left ? 0.1 : 1,
      tr: clipped.top || clipped.right ? 0.1 : 1,
      bl: clipped.bottom || clipped.left ? 0.1 : 1,
      br: clipped.bottom || clipped.right ? 0.1 : 1,
    }
    q.forEach(function (el) {
      el.style.opacity = opacities[el.dataset.quadrant]
    })
  }

  function onKeyDown(e) {
    if (
      !overlay ||
      !isHovering ||
      e.target.tagName === 'INPUT' ||
      e.target.tagName === 'TEXTAREA' ||
      e.target.isContentEditable
    )
      return

    let changed = false

    switch (e.key) {
      case 'ArrowUp':
        clipped.bottom = !clipped.bottom
        changed = true
        break
      case 'ArrowDown':
        clipped.top = !clipped.top
        changed = true
        break
      case 'ArrowLeft':
        clipped.right = !clipped.right
        changed = true
        break
      case 'ArrowRight':
        clipped.left = !clipped.left
        changed = true
        break
    }

    if (changed) {
      e.preventDefault()
      e.stopPropagation()
      updateOpacity()
    }
  }

  function onFullscreenChange() {
    const fsEl =
      document.fullscreenElement || document.webkitFullscreenElement
    if (fsEl && overlay) {
      inFullscreen = true
      fsEl.appendChild(overlay)
      overlay.style.position = 'absolute'
      overlay.style.bottom = '10%'
      overlay.style.left = '50%'
      overlay.style.transform = 'translateX(-50%)'
      overlay.style.top = 'auto'
    } else if (!fsEl && overlay) {
      inFullscreen = false
      document.body.appendChild(overlay)
      overlay.style.position = 'fixed'
      if (pos.top != null) {
        overlay.style.top = pos.top + 'px'
        overlay.style.left = (pos.left || 0) + 'px'
        overlay.style.bottom = 'auto'
        overlay.style.transform = 'none'
      } else {
        overlay.style.bottom = (pos.bottom || 50) + 'px'
        overlay.style.left = '50%'
        overlay.style.transform = 'translateX(-50%)'
        overlay.style.top = 'auto'
      }
    }
  }

  function show() {
    if (overlay) overlay.style.display = 'block'
  }

  function hide() {
    if (overlay) overlay.style.display = 'none'
  }

  function onMessage(request, sender, sendResponse) {
    switch (request.action) {
      case 'toggle':
        ensureOverlay()
        if (overlay.style.display === 'none') show()
        else hide()
        settings.visible = overlay.style.display !== 'none'
        chrome.storage.sync.set({ visible: settings.visible })
        sendResponse({ visible: settings.visible })
        break

      case 'resize':
        ensureOverlay()
        overlay.style.width = request.width + 'px'
        overlay.style.height = request.height + 'px'
        settings.width = request.width
        settings.height = request.height
        chrome.storage.sync.set({ width: request.width, height: request.height })
        sendResponse({ width: request.width, height: request.height })
        break

      case 'getStatus':
        sendResponse({
          visible: overlay ? overlay.style.display !== 'none' : false,
          width: settings.width,
          height: settings.height,
          hasVideo: detectVideo(),
          exists: !!overlay,
        })
        break
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }
})()
