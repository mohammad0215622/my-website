local QBCore, ESX = nil, nil
local PlayerTokens = {}
local RateLimits = {}

-- Framework initialization
CreateThread(function()
    if Config.Framework == 'qbcore' then
        QBCore = exports['qb-core']:GetCoreObject()
    elseif Config.Framework == 'esx' then
        ESX = exports['es_extended']:getSharedObject()
    end
end)

-- Utility: Get player identifier
local function GetPlayerIdentifier(source)
    if Config.Framework == 'qbcore' then
        local Player = QBCore.Functions.GetPlayer(source)
        return Player and Player.PlayerData.citizenid or nil
    elseif Config.Framework == 'esx' then
        local xPlayer = ESX.GetPlayerFromId(source)
        return xPlayer and xPlayer.identifier or nil
    end
    return nil
end

-- Utility: Get player job
local function GetPlayerJob(source)
    if Config.Framework == 'qbcore' then
        local Player = QBCore.Functions.GetPlayer(source)
        return Player and Player.PlayerData.job.name or nil
    elseif Config.Framework == 'esx' then
        local xPlayer = ESX.GetPlayerFromId(source)
        return xPlayer and xPlayer.job.name or nil
    end
    return nil
end

-- Security: Generate session token
local function GenerateToken(source)
    local token = ('%s_%s_%d'):format(
        GetPlayerIdentifier(source) or 'unknown',
        os.time(),
        math.random(100000, 999999)
    )
    PlayerTokens[source] = {token = token, time = os.time()}
    return token
end

-- Security: Validate token
local function ValidateToken(source, token)
    local data = PlayerTokens[source]
    if not data then return false end
    if data.token ~= token then return false end
    if os.time() - data.time > Config.Security.tokenExpiry then
        PlayerTokens[source] = nil
        return false
    end
    return true
end

-- Security: Rate limiting
local function CheckRateLimit(source)
    if not Config.Security.rateLimitEvents then return true end
    local now = os.time()
    if not RateLimits[source] then
        RateLimits[source] = {count = 1, time = now}
        return true
    end
    if now - RateLimits[source].time >= 1 then
        RateLimits[source] = {count = 1, time = now}
        return true
    end
    RateLimits[source].count = RateLimits[source].count + 1
    return RateLimits[source].count <= Config.Security.maxEventsPerSecond
end

-- Clean up on player drop
AddEventHandler('playerDropped', function()
    local source = source
    PlayerTokens[source] = nil
    RateLimits[source] = nil
end)

-- ===========================================
-- DATABASE OPERATIONS
-- ===========================================

-- Initialize player computer data
RegisterNetEvent('computer:server:initPlayer', function()
    local source = source
    if not CheckRateLimit(source) then return end

    local identifier = GetPlayerIdentifier(source)
    if not identifier then return end

    local result = MySQL.query.await('SELECT * FROM ' .. Config.SQLPrefix .. 'users WHERE identifier = ?', {identifier})

    if not result or #result == 0 then
        MySQL.insert.await(
            'INSERT INTO ' .. Config.SQLPrefix .. 'users (identifier, password, wallpaper, theme, settings) VALUES (?, ?, ?, ?, ?)',
            {identifier, Config.Login.defaultPassword, Config.DefaultWallpaper, Config.DefaultTheme, '{}'}
        )
        result = MySQL.query.await('SELECT * FROM ' .. Config.SQLPrefix .. 'users WHERE identifier = ?', {identifier})
    end

    local token = GenerateToken(source)
    local job = GetPlayerJob(source)

    TriggerClientEvent('computer:client:initData', source, {
        token = token,
        userData = result[1],
        job = job,
        apps = Config.Apps
    })
end)

-- Update user settings
RegisterNetEvent('computer:server:updateSettings', function(token, settings)
    local source = source
    if not CheckRateLimit(source) then return end
    if not ValidateToken(source, token) then return end

    local identifier = GetPlayerIdentifier(source)
    if not identifier then return end

    MySQL.update.await(
        'UPDATE ' .. Config.SQLPrefix .. 'users SET wallpaper = ?, theme = ?, settings = ? WHERE identifier = ?',
        {settings.wallpaper or Config.DefaultWallpaper, settings.theme or Config.DefaultTheme, json.encode(settings.extra or {}), identifier}
    )
end)

-- Update password
RegisterNetEvent('computer:server:updatePassword', function(token, oldPass, newPass)
    local source = source
    if not CheckRateLimit(source) then return end
    if not ValidateToken(source, token) then return end

    local identifier = GetPlayerIdentifier(source)
    if not identifier then return end

    local result = MySQL.query.await(
        'SELECT password FROM ' .. Config.SQLPrefix .. 'users WHERE identifier = ?',
        {identifier}
    )

    if result and #result > 0 and result[1].password == oldPass then
        MySQL.update.await(
            'UPDATE ' .. Config.SQLPrefix .. 'users SET password = ? WHERE identifier = ?',
            {newPass, identifier}
        )
        TriggerClientEvent('computer:client:notify', source, 'success', 'Password updated successfully')
    else
        TriggerClientEvent('computer:client:notify', source, 'error', 'Incorrect current password')
    end
end)

-- ===========================================
-- APP: BANK
-- ===========================================

RegisterNetEvent('computer:server:getBank', function(token)
    local source = source
    if not CheckRateLimit(source) then return end
    if not ValidateToken(source, token) then return end

    local identifier = GetPlayerIdentifier(source)
    local bankData = {balance = 0, transactions = {}}

    if Config.Framework == 'qbcore' then
        local Player = QBCore.Functions.GetPlayer(source)
        if Player then
            bankData.balance = Player.PlayerData.money.bank or 0
        end
    elseif Config.Framework == 'esx' then
        local xPlayer = ESX.GetPlayerFromId(source)
        if xPlayer then
            bankData.balance = xPlayer.getAccount('bank').money or 0
        end
    end

    local transactions = MySQL.query.await(
        'SELECT * FROM ' .. Config.SQLPrefix .. 'transactions WHERE identifier = ? ORDER BY created_at DESC LIMIT 20',
        {identifier}
    )
    bankData.transactions = transactions or {}

    TriggerClientEvent('computer:client:bankData', source, bankData)
end)

RegisterNetEvent('computer:server:bankTransfer', function(token, targetId, amount, note)
    local source = source
    if not CheckRateLimit(source) then return end
    if not ValidateToken(source, token) then return end

    local identifier = GetPlayerIdentifier(source)
    amount = tonumber(amount)
    if not amount or amount <= 0 then return end

    if Config.Framework == 'qbcore' then
        local Player = QBCore.Functions.GetPlayer(source)
        if Player and Player.PlayerData.money.bank >= amount then
            Player.Functions.RemoveMoney('bank', amount, 'computer-transfer')

            MySQL.insert.await(
                'INSERT INTO ' .. Config.SQLPrefix .. 'transactions (identifier, type, amount, note) VALUES (?, ?, ?, ?)',
                {identifier, 'transfer_out', amount, note or ('Transfer to ' .. targetId)}
            )

            TriggerClientEvent('computer:client:notify', source, 'success', ('$%s transferred'):format(amount))
            TriggerEvent('computer:server:getBank', token)
        else
            TriggerClientEvent('computer:client:notify', source, 'error', 'Insufficient funds')
        end
    end
end)

-- ===========================================
-- APP: EMAILS
-- ===========================================

RegisterNetEvent('computer:server:getEmails', function(token)
    local source = source
    if not CheckRateLimit(source) then return end
    if not ValidateToken(source, token) then return end

    local identifier = GetPlayerIdentifier(source)
    local emails = MySQL.query.await(
        'SELECT * FROM ' .. Config.SQLPrefix .. 'emails WHERE recipient = ? ORDER BY created_at DESC LIMIT 50',
        {identifier}
    )

    TriggerClientEvent('computer:client:emailData', source, emails or {})
end)

RegisterNetEvent('computer:server:sendEmail', function(token, recipient, subject, body)
    local source = source
    if not CheckRateLimit(source) then return end
    if not ValidateToken(source, token) then return end

    local identifier = GetPlayerIdentifier(source)

    MySQL.insert.await(
        'INSERT INTO ' .. Config.SQLPrefix .. 'emails (sender, recipient, subject, body) VALUES (?, ?, ?, ?)',
        {identifier, recipient, subject, body}
    )

    TriggerClientEvent('computer:client:notify', source, 'success', 'Email sent')
end)

RegisterNetEvent('computer:server:deleteEmail', function(token, emailId)
    local source = source
    if not CheckRateLimit(source) then return end
    if not ValidateToken(source, token) then return end

    local identifier = GetPlayerIdentifier(source)
    MySQL.update.await(
        'DELETE FROM ' .. Config.SQLPrefix .. 'emails WHERE id = ? AND recipient = ?',
        {emailId, identifier}
    )
end)

-- ===========================================
-- APP: TWITTER / CHIRPER
-- ===========================================

RegisterNetEvent('computer:server:getTwitter', function(token)
    local source = source
    if not CheckRateLimit(source) then return end
    if not ValidateToken(source, token) then return end

    local tweets = MySQL.query.await(
        'SELECT * FROM ' .. Config.SQLPrefix .. 'tweets ORDER BY created_at DESC LIMIT 50',
        {}
    )

    TriggerClientEvent('computer:client:twitterData', source, tweets or {})
end)

RegisterNetEvent('computer:server:postTweet', function(token, content)
    local source = source
    if not CheckRateLimit(source) then return end
    if not ValidateToken(source, token) then return end

    local identifier = GetPlayerIdentifier(source)
    if not content or #content == 0 or #content > 280 then return end

    local username = 'Anonymous'
    if Config.Framework == 'qbcore' then
        local Player = QBCore.Functions.GetPlayer(source)
        if Player then
            username = Player.PlayerData.charinfo.firstname .. ' ' .. Player.PlayerData.charinfo.lastname
        end
    elseif Config.Framework == 'esx' then
        local xPlayer = ESX.GetPlayerFromId(source)
        if xPlayer then
            username = xPlayer.getName()
        end
    end

    MySQL.insert.await(
        'INSERT INTO ' .. Config.SQLPrefix .. 'tweets (identifier, username, content) VALUES (?, ?, ?)',
        {identifier, username, content}
    )

    TriggerClientEvent('computer:client:notify', source, 'success', 'Tweet posted!')
    TriggerEvent('computer:server:getTwitter', token)
end)

-- ===========================================
-- APP: NOTES / FILES
-- ===========================================

RegisterNetEvent('computer:server:getNotes', function(token)
    local source = source
    if not CheckRateLimit(source) then return end
    if not ValidateToken(source, token) then return end

    local identifier = GetPlayerIdentifier(source)
    local notes = MySQL.query.await(
        'SELECT * FROM ' .. Config.SQLPrefix .. 'notes WHERE identifier = ? ORDER BY updated_at DESC',
        {identifier}
    )

    TriggerClientEvent('computer:client:notesData', source, notes or {})
end)

RegisterNetEvent('computer:server:saveNote', function(token, noteId, title, content)
    local source = source
    if not CheckRateLimit(source) then return end
    if not ValidateToken(source, token) then return end

    local identifier = GetPlayerIdentifier(source)

    if noteId then
        MySQL.update.await(
            'UPDATE ' .. Config.SQLPrefix .. 'notes SET title = ?, content = ?, updated_at = NOW() WHERE id = ? AND identifier = ?',
            {title, content, noteId, identifier}
        )
    else
        MySQL.insert.await(
            'INSERT INTO ' .. Config.SQLPrefix .. 'notes (identifier, title, content) VALUES (?, ?, ?)',
            {identifier, title, content}
        )
    end

    TriggerClientEvent('computer:client:notify', source, 'success', 'Note saved')
end)

RegisterNetEvent('computer:server:deleteNote', function(token, noteId)
    local source = source
    if not CheckRateLimit(source) then return end
    if not ValidateToken(source, token) then return end

    local identifier = GetPlayerIdentifier(source)
    MySQL.update.await(
        'DELETE FROM ' .. Config.SQLPrefix .. 'notes WHERE id = ? AND identifier = ?',
        {noteId, identifier}
    )
end)

-- ===========================================
-- APP: MDT (Police/EMS)
-- ===========================================

RegisterNetEvent('computer:server:getMDT', function(token, searchQuery)
    local source = source
    if not CheckRateLimit(source) then return end
    if not ValidateToken(source, token) then return end

    local job = GetPlayerJob(source)
    if job ~= 'police' and job ~= 'ambulance' then
        TriggerClientEvent('computer:client:notify', source, 'error', 'Access denied')
        return
    end

    local records = {}
    if searchQuery and #searchQuery > 0 then
        records = MySQL.query.await(
            'SELECT * FROM ' .. Config.SQLPrefix .. 'mdt_records WHERE name LIKE ? OR details LIKE ? ORDER BY created_at DESC LIMIT 30',
            {'%' .. searchQuery .. '%', '%' .. searchQuery .. '%'}
        )
    else
        records = MySQL.query.await(
            'SELECT * FROM ' .. Config.SQLPrefix .. 'mdt_records ORDER BY created_at DESC LIMIT 30',
            {}
        )
    end

    TriggerClientEvent('computer:client:mdtData', source, records or {})
end)

RegisterNetEvent('computer:server:addMDTRecord', function(token, data)
    local source = source
    if not CheckRateLimit(source) then return end
    if not ValidateToken(source, token) then return end

    local job = GetPlayerJob(source)
    if job ~= 'police' and job ~= 'ambulance' then return end

    local identifier = GetPlayerIdentifier(source)

    MySQL.insert.await(
        'INSERT INTO ' .. Config.SQLPrefix .. 'mdt_records (author, name, category, details) VALUES (?, ?, ?, ?)',
        {identifier, data.name or '', data.category or 'general', data.details or ''}
    )

    TriggerClientEvent('computer:client:notify', source, 'success', 'Record added')
end)

-- ===========================================
-- REFRESH TOKEN
-- ===========================================

RegisterNetEvent('computer:server:refreshToken', function()
    local source = source
    if not CheckRateLimit(source) then return end

    local token = GenerateToken(source)
    TriggerClientEvent('computer:client:tokenRefreshed', source, token)
end)

-- ===========================================
-- CLEANUP THREAD
-- ===========================================

CreateThread(function()
    while true do
        Wait(60000)
        local now = os.time()
        for src, data in pairs(PlayerTokens) do
            if now - data.time > Config.Security.tokenExpiry then
                PlayerTokens[src] = nil
            end
        end
        for src, data in pairs(RateLimits) do
            if now - data.time > 10 then
                RateLimits[src] = nil
            end
        end
    end
end)

print('^2[Computer]^0 Server-side loaded successfully')
