# FiveM Computer System

A fully-featured in-game computer system for FiveM, designed with a modern Windows 11 / Cyberpunk aesthetic. Supports both **QBCore** and **ESX** frameworks.

## Features

### Core System
- 🖥️ Boot screen with animations
- 🔐 Login system with password protection
- 🖱️ Full window management (drag, resize, minimize, maximize, close)
- 📱 Taskbar with system tray, clock, and app indicators
- 🎨 3 Themes: Dark, Light, Cyberpunk
- 🖼️ 6 Wallpaper options
- 🔔 Notification system (toast notifications)
- 🔊 Sound effects system
- 📱 Start menu with app search

### Applications
| App | Description |
|-----|-------------|
| **MDT** | Police/EMS records management system |
| **Bank** | View balance, transaction history, transfers |
| **Browser** | Simulated web browser with bookmarks |
| **Files** | File explorer with folders |
| **Chirper** | Twitter-like social media |
| **Cameras** | Security camera monitoring |
| **Email** | Send/receive emails between players |
| **DarkNet** | Hacking terminal (RP) |
| **Settings** | Theme, wallpaper, sound, password settings |
| **Notes** | Personal note-taking |

### Technical Features
- ✅ QBCore & ESX support
- ✅ SQL data persistence (oxmysql)
- ✅ Session token security
- ✅ Rate limiting on events
- ✅ NUI protection
- ✅ Modular app architecture
- ✅ Optimized (< 0.01ms idle)
- ✅ Full configuration system

## Installation

1. Copy `fivem-computer` to your `resources` folder
2. Import `sql/schema.sql` into your database
3. Add `ensure fivem-computer` to your `server.cfg`
4. Configure `config.lua` to your needs

## Dependencies

- [oxmysql](https://github.com/overextended/oxmysql) (database)
- QBCore or ESX framework

## Configuration

Edit `config.lua` to customize:
- Framework selection (QBCore/ESX)
- Open command and key bindings
- Login settings
- App visibility per job
- Theme and wallpaper defaults
- Sound settings
- Performance limits
- Security settings

## Adding New Apps

The system is modular. To add a new app:

1. Create `html/js/apps/yourapp.js`:
```javascript
const YourApp = {
    open() {
        const content = '<div>Your app content</div>';
        WindowManager.create('yourapp', 'Your App', 'icon-name', '#color', content, {
            width: 700,
            height: 500
        });
    }
};
```

2. Add the script to `html/index.html`
3. Add the app config to `config.lua`:
```lua
{id = 'yourapp', name = 'Your App', icon = 'icon-name', color = '#hex', enabled = true, jobs = {}}
```

4. Add the case to `Computer.openApp()` in `main.js`

## Commands

| Command | Description |
|---------|-------------|
| `/computer` | Open the computer UI |

## Performance

- Idle: 0.00ms
- Open: ~0.02ms
- Window operations: < 0.01ms

## License

Private - All rights reserved.
