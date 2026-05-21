---
name: testing-fivem-computer
description: Test the FiveM Computer NUI system end-to-end. Use when verifying UI changes to the computer system (boot, login, desktop, apps, window management, themes).
---

# Testing FiveM Computer NUI

## Overview
The FiveM Computer system is an in-game NUI (HTML/CSS/JS) that renders a Windows-like desktop inside FiveM. The entire frontend can be tested standalone by opening `html/index.html` in a browser and simulating NUI messages.

## Testing Approach

### Setup
1. Open `html/index.html` in Chrome via `file://` protocol
2. The page will appear blank (the computer UI starts hidden)
3. Use browser console to simulate NUI messages

### Trigger Boot/Login/Desktop
```javascript
// Open the computer (triggers boot screen)
window.postMessage({action:'open'}, '*')

// After login, send initData to populate apps
window.postMessage({action:'initData', userData:{password:'1234',theme:'dark',wallpaper:1}, job:'police', apps:[{id:'mdt',name:'MDT',icon:'shield-halved',color:'#3b82f6',enabled:true,jobs:['police']},{id:'bank',name:'Bank',icon:'building-columns',color:'#10b981',enabled:true,jobs:[]},{id:'browser',name:'Browser',icon:'globe',color:'#6366f1',enabled:true,jobs:[]},{id:'files',name:'Files',icon:'folder',color:'#f59e0b',enabled:true,jobs:[]},{id:'twitter',name:'Chirper',icon:'hashtag',color:'#06b6d4',enabled:true,jobs:[]},{id:'cameras',name:'Cameras',icon:'video',color:'#ef4444',enabled:true,jobs:['police']},{id:'emails',name:'Email',icon:'envelope',color:'#8b5cf6',enabled:true,jobs:[]},{id:'hacking',name:'DarkNet',icon:'skull-crossbones',color:'#dc2626',enabled:true,jobs:[]},{id:'settings',name:'Settings',icon:'gear',color:'#6b7280',enabled:true,jobs:[]},{id:'notes',name:'Notes',icon:'sticky-note',color:'#fbbf24',enabled:true,jobs:[]}]}, '*')
```

### Important: Order of Operations
- Send `initData` BEFORE login if you want desktop icons to appear immediately after login
- If `initData` is sent after login, you need to manually call `Computer.renderDesktopIcons()` and `Computer.renderStartMenuApps()` from console

### Default Login Password
- Password: `1234` (configured in `config.lua` under `Config.Login.defaultPassword`)

## What Can Be Tested Client-Side
- Boot animation → login screen transition (~3s)
- Login validation (wrong password shows error, correct password advances)
- Desktop rendering (icons, taskbar, clock)
- Window management (open, maximize, minimize, restore, drag, resize, close)
- Start Menu (open/close, app grid, search filtering)
- Theme switching (Dark/Light/Cyberpunk) via Settings app
- Wallpaper changes via Settings app
- App UI rendering (all 10 apps open and display their interfaces)
- DarkNet terminal commands (help, scan, crack, exploit, decrypt, clear, exit)
- Notification toasts

## What Cannot Be Tested Without FiveM Server
- Bank transfers and balance updates (requires server callbacks)
- Email sending/receiving between players
- MDT record creation and search
- Twitter/Chirper posting
- File system operations
- Data persistence (SQL)
- Sound effects (requires .ogg files in html/sounds/)
- NUI callbacks (fetch to resource name will fail)

## Key Test Assertions
1. **Boot**: Boot screen visible for ~3s with spinning dots animation
2. **Login**: Wrong password → error message appears briefly (2s auto-hide); correct password → desktop
3. **Desktop**: 10 app icons visible in grid, taskbar with clock/system tray
4. **Windows**: Title bar with min/max/close buttons; drag moves window; maximize fills viewport
5. **Start Menu**: Click Windows logo → menu with search + app grid + Shut Down button
6. **Themes**: Cyberpunk = magenta/neon borders; Light = white backgrounds; Dark = dark gray
7. **Toast**: Theme change shows "Theme updated" notification in top-right

## Devin Secrets Needed
None - all testing is client-side with no authentication required.
