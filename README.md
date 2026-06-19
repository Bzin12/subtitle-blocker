# Subtitle Blocker / 字幕遮挡器

A Chrome extension that covers video subtitles with a resizable black rectangle. Works in both normal and fullscreen mode.

一个 Chrome 扩展程序，用可调整大小的黑色矩形遮挡视频字幕。在普通模式和全屏模式下均可使用。

## Features / 功能

- **Auto-detect** — black rectangle appears automatically on pages with video content
- **Resizable** — drag the corner handle or use the popup sliders to adjust width and height
- **Draggable** — click and drag anywhere on the rectangle to reposition it
- **Fullscreen support** — the rectangle follows the video into fullscreen and stays on top of subtitles
- **Persistent settings** — size and visibility are saved between sessions

- **自动检测** — 打开包含视频的页面时，黑色矩形自动出现
- **可调整大小** — 拖动右下角手柄或使用弹出窗口中的滑块调整宽度和高度
- **可拖动** — 点击并拖动矩形任意位置重新定位
- **全屏支持** — 矩形跟随视频进入全屏模式，始终位于字幕上方
- **设置持久化** — 大小和可见性设置在每次会话之间自动保存

## Installation / 安装方法

1. Open Chrome and go to `chrome://extensions`
2. Enable **Developer mode** (toggle in top-right corner)
3. Click **Load unpacked** and select the `subtitle-blocker` folder
4. The extension is now ready to use

1. 打开 Chrome 浏览器，访问 `chrome://extensions`
2. 开启右上角的**开发者模式**
3. 点击**加载已解压的扩展程序**，选择 `subtitle-blocker` 文件夹
4. 扩展程序即可使用

## Usage / 使用方法

- Click the extension icon in the toolbar to open the popup
- Adjust **Width** and **Height** sliders to resize the rectangle
- Click **Hide / Show** to toggle visibility
- On the page, **drag** the rectangle to move it
- **Drag the bottom-right corner** to resize it directly

- 点击工具栏中的扩展图标打开弹出窗口
- 调整**宽度**和**高度**滑块来改变矩形大小
- 点击**隐藏/显示**切换可见性
- 在页面上**拖动**矩形来移动位置
- **拖动右下角**直接调整大小

## Files / 文件说明

| File | Description |
|------|-------------|
| `manifest.json` | Extension manifest (Manifest V3) |
| `content.js` | Content script — creates and manages the overlay |
| `popup.html` | Popup UI |
| `popup.js` | Popup logic — communicates with content script |

## Notes / 说明

- The rectangle only appears on pages that contain `<video>`, `<embed>`, or `<object>` elements
- Works with YouTube, Netflix, Vimeo, local video files, and most other video players
- The rectangle is pure black for maximum subtitle coverage

- 矩形仅在包含 `<video>`、`<embed>` 或 `<object>` 元素的页面上出现
- 支持 YouTube、Netflix、Vimeo、本地视频文件及大多数其他视频播放器
- 矩形为纯黑色，以达到最佳字幕遮挡效果
