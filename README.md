# Subtitle Blocker / 字幕遮挡器

A Chrome extension that covers video subtitles with a resizable black rectangle. Works in both normal and fullscreen mode. Arrow keys toggle half of the rectangle to 90% transparency so you can peek at the subtitles underneath.

一个 Chrome 扩展程序，用可调整大小的黑色矩形遮挡视频字幕。在普通模式和全屏模式下均可使用。方向键可让矩形对应半段变为 90% 透明，方便临时查看下方字幕。

## Features / 功能

- **Auto-detect** — black rectangle appears automatically on pages with video content
- **Resizable** — drag the corner handle or use the popup sliders to adjust width and height
- **Draggable** — click and drag anywhere on the rectangle to reposition it
- **Fullscreen support** — the rectangle follows the video into fullscreen and stays on top of subtitles
- **Persistent settings** — size and visibility are saved between sessions
- **90% transparency toggle** — arrow keys make halves semi-transparent instead of fully hiding them
- **Hover-activated shortcuts** — arrow keys only work when the mouse is over the rectangle, preventing interference with video controls
- **Event capture** — when hovering over the rectangle, arrow keys are fully intercepted and won't affect video playback (volume, seeking) or page scrolling

- **自动检测** — 打开包含视频的页面时，黑色矩形自动出现
- **可调整大小** — 拖动右下角手柄或使用弹出窗口中的滑块调整宽度和高度
- **可拖动** — 点击并拖动矩形任意位置重新定位
- **全屏支持** — 矩形跟随视频进入全屏模式，始终位于字幕上方
- **设置持久化** — 大小和可见性设置在每次会话之间自动保存
- **90% 透明度切换** — 方向键让对应半段变为半透明，而非完全消失
- **悬停激活快捷键** — 鼠标悬停在矩形上方时方向键才生效，不影响视频控件
- **事件拦截** — 悬停矩形时方向键被完全拦截，不会影响视频播放（音量、进度）或页面滚动

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
- **Hover** your mouse over the rectangle, then use **Arrow keys** to reveal subtitles:
  - `↑` — bottom half becomes 90% transparent (subtitles below show through); press again to restore
  - `↓` — top half becomes 90% transparent (subtitles above show through); press again to restore
  - `←` — right half becomes 90% transparent (subtitles on the right show through); press again to restore
  - `→` — left half becomes 90% transparent (subtitles on the left show through); press again to restore
- The arrow points in the direction that stays covered; the **opposite** half turns transparent so you can read the subtitles underneath
- Multiple halves can be transparent at the same time for a smaller effective viewing area

- 点击工具栏中的扩展图标打开弹出窗口
- 调整**宽度**和**高度**滑块来调整矩形大小
- 点击**隐藏/显示**切换可见性
- 在页面上**拖动**矩形来移动位置
- **拖动右下角**直接调整大小
- **鼠标悬停**在矩形上，然后使用**方向键**查看字幕：
  - `↑` — 下半段变为 90% 透明（下方的字幕显示出来），再次按下恢复遮挡
  - `↓` — 上半段变为 90% 透明（上方的字幕显示出来），再次按下恢复遮挡
  - `←` — 右半段变为 90% 透明（右侧的字幕显示出来），再次按下恢复遮挡
  - `→` — 左半段变为 90% 透明（左侧的字幕显示出来），再次按下恢复遮挡
- 箭头的方向表示保持遮挡的那一侧，**相反方向**的黑色方块变为 90% 透明，从而显示字幕
- 此功能用于在没听清或没听懂时，临时查看字幕内容
- 可同时将多个半段设为透明，以获得更小的有效遮挡区域

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
- The rectangle is pure black for maximum subtitle coverage; transparent halves become 90% transparent (10% opacity) to let video show through
- Arrow key shortcuts only activate when the mouse is hovering over the rectangle — no accidental interference with video playback

- 矩形仅在包含 `<video>`、`<embed>` 或 `<object>` 元素的页面上出现
- 支持 YouTube、Netflix、Vimeo、本地视频文件及大多数其他视频播放器
- 矩形为纯黑色，以达到最佳字幕遮挡效果；透明半段为 90% 透明度（10% 不透明度），让视频内容透出
- 方向键快捷键仅在鼠标悬停于矩形上时生效，不会意外干扰视频播放
