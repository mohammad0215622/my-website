Config = {}

-- Framework: 'qbcore' or 'esx'
Config.Framework = 'qbcore'

-- Command to open computer
Config.OpenCommand = 'computer'
Config.OpenKey = 'E' -- Interaction key

-- Computer prop model
Config.PropModel = 'prop_laptop_01a'

-- Computer locations (set to {} for portable/item-based)
Config.Locations = {
    -- vector3(-1044.54, -2739.84, 13.85),
}

-- Item-based opening (requires item in inventory)
Config.RequireItem = false
Config.ItemName = 'laptop'

-- Login system
Config.Login = {
    enabled = true,
    defaultPassword = '1234',
    maxAttempts = 5,
    lockoutTime = 60 -- seconds
}

-- Boot screen duration (ms)
Config.BootDuration = 3000

-- Default wallpaper (index)
Config.DefaultWallpaper = 1

-- Available wallpapers
Config.Wallpapers = {
    'default_win11.jpg',
    'cyberpunk_city.jpg',
    'dark_abstract.jpg',
    'neon_grid.jpg',
    'mountain_sunset.jpg'
}

-- Default theme: 'light', 'dark', 'cyberpunk'
Config.DefaultTheme = 'dark'

-- Applications configuration
Config.Apps = {
    {id = 'mdt', name = 'MDT', icon = 'shield-halved', color = '#3b82f6', enabled = true, jobs = {'police', 'ambulance'}},
    {id = 'bank', name = 'Bank', icon = 'building-columns', color = '#10b981', enabled = true, jobs = {}},
    {id = 'browser', name = 'Browser', icon = 'globe', color = '#6366f1', enabled = true, jobs = {}},
    {id = 'files', name = 'Files', icon = 'folder', color = '#f59e0b', enabled = true, jobs = {}},
    {id = 'twitter', name = 'Chirper', icon = 'hashtag', color = '#06b6d4', enabled = true, jobs = {}},
    {id = 'cameras', name = 'Cameras', icon = 'video', color = '#ef4444', enabled = true, jobs = {'police', 'security'}},
    {id = 'emails', name = 'Email', icon = 'envelope', color = '#8b5cf6', enabled = true, jobs = {}},
    {id = 'hacking', name = 'DarkNet', icon = 'skull-crossbones', color = '#dc2626', enabled = true, jobs = {}},
    {id = 'settings', name = 'Settings', icon = 'gear', color = '#6b7280', enabled = true, jobs = {}},
    {id = 'notes', name = 'Notes', icon = 'sticky-note', color = '#fbbf24', enabled = true, jobs = {}},
}

-- Sound effects
Config.Sounds = {
    boot = 'boot.ogg',
    login = 'login.ogg',
    click = 'click.ogg',
    notify = 'notify.ogg',
    error = 'error.ogg',
    shutdown = 'shutdown.ogg'
}

-- Performance
Config.Performance = {
    maxOpenWindows = 8,
    animationDuration = 200, -- ms
    reducedMotion = false
}

-- Security
Config.Security = {
    tokenExpiry = 300, -- seconds
    rateLimitEvents = true,
    maxEventsPerSecond = 10
}

-- SQL table prefix
Config.SQLPrefix = 'computer_'
