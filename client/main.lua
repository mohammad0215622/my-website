local isOpen = false
local sessionToken = nil
local playerJob = nil

-- Framework detection
local QBCore, ESX = nil, nil

CreateThread(function()
    if Config.Framework == 'qbcore' then
        local success, result = pcall(function()
            return exports['qb-core']:GetCoreObject()
        end)
        if not success then
            success, result = pcall(function()
                return exports['qb-core']:GetSharedObject()
            end)
        end
        QBCore = result
    elseif Config.Framework == 'esx' then
        ESX = exports['es_extended']:getSharedObject()
    end
end)

-- ===========================================
-- OPEN / CLOSE COMPUTER
-- ===========================================

local function OpenComputer()
    if isOpen then return end
    isOpen = true

    SetNuiFocus(true, true)
    SendNUIMessage({action = 'open'})
    TriggerServerEvent('computer:server:initPlayer')
end

local function CloseComputer()
    if not isOpen then return end
    isOpen = false

    SetNuiFocus(false, false)
    SendNUIMessage({action = 'close'})
    sessionToken = nil
end

-- Command to open
RegisterCommand(Config.OpenCommand, function()
    if Config.RequireItem then
        if Config.Framework == 'qbcore' then
            local hasItem = QBCore.Functions.HasItem(Config.ItemName)
            if not hasItem then
                TriggerEvent('QBCore:Notify', 'You don\'t have a laptop', 'error')
                return
            end
        end
    end
    OpenComputer()
end, false)

-- Key mapping
RegisterKeyMapping(Config.OpenCommand, 'Open Computer', 'keyboard', '')

-- ===========================================
-- NUI CALLBACKS
-- ===========================================

RegisterNUICallback('close', function(_, cb)
    CloseComputer()
    cb('ok')
end)

RegisterNUICallback('loaded', function(_, cb)
    cb('ok')
end)

RegisterNUICallback('getApps', function(_, cb)
    local availableApps = {}
    for _, app in ipairs(Config.Apps) do
        if app.enabled then
            if #app.jobs == 0 or (playerJob and HasValue(app.jobs, playerJob)) then
                table.insert(availableApps, app)
            end
        end
    end
    cb(json.encode(availableApps))
end)

-- Settings callbacks
RegisterNUICallback('updateSettings', function(data, cb)
    if sessionToken then
        TriggerServerEvent('computer:server:updateSettings', sessionToken, data)
    end
    cb('ok')
end)

RegisterNUICallback('updatePassword', function(data, cb)
    if sessionToken then
        TriggerServerEvent('computer:server:updatePassword', sessionToken, data.oldPassword, data.newPassword)
    end
    cb('ok')
end)

-- Bank callbacks
RegisterNUICallback('getBank', function(_, cb)
    if sessionToken then
        TriggerServerEvent('computer:server:getBank', sessionToken)
    end
    cb('ok')
end)

RegisterNUICallback('bankTransfer', function(data, cb)
    if sessionToken then
        TriggerServerEvent('computer:server:bankTransfer', sessionToken, data.targetId, data.amount, data.note)
    end
    cb('ok')
end)

-- Email callbacks
RegisterNUICallback('getEmails', function(_, cb)
    if sessionToken then
        TriggerServerEvent('computer:server:getEmails', sessionToken)
    end
    cb('ok')
end)

RegisterNUICallback('sendEmail', function(data, cb)
    if sessionToken then
        TriggerServerEvent('computer:server:sendEmail', sessionToken, data.recipient, data.subject, data.body)
    end
    cb('ok')
end)

RegisterNUICallback('deleteEmail', function(data, cb)
    if sessionToken then
        TriggerServerEvent('computer:server:deleteEmail', sessionToken, data.id)
    end
    cb('ok')
end)

-- Twitter callbacks
RegisterNUICallback('getTwitter', function(_, cb)
    if sessionToken then
        TriggerServerEvent('computer:server:getTwitter', sessionToken)
    end
    cb('ok')
end)

RegisterNUICallback('postTweet', function(data, cb)
    if sessionToken then
        TriggerServerEvent('computer:server:postTweet', sessionToken, data.content)
    end
    cb('ok')
end)

-- Notes callbacks
RegisterNUICallback('getNotes', function(_, cb)
    if sessionToken then
        TriggerServerEvent('computer:server:getNotes', sessionToken)
    end
    cb('ok')
end)

RegisterNUICallback('saveNote', function(data, cb)
    if sessionToken then
        TriggerServerEvent('computer:server:saveNote', sessionToken, data.id, data.title, data.content)
    end
    cb('ok')
end)

RegisterNUICallback('deleteNote', function(data, cb)
    if sessionToken then
        TriggerServerEvent('computer:server:deleteNote', sessionToken, data.id)
    end
    cb('ok')
end)

-- MDT callbacks
RegisterNUICallback('getMDT', function(data, cb)
    if sessionToken then
        TriggerServerEvent('computer:server:getMDT', sessionToken, data.query or '')
    end
    cb('ok')
end)

RegisterNUICallback('addMDTRecord', function(data, cb)
    if sessionToken then
        TriggerServerEvent('computer:server:addMDTRecord', sessionToken, data)
    end
    cb('ok')
end)

-- ===========================================
-- CLIENT EVENTS
-- ===========================================

RegisterNetEvent('computer:client:initData', function(data)
    sessionToken = data.token
    playerJob = data.job

    SendNUIMessage({
        action = 'initData',
        userData = data.userData,
        job = data.job,
        apps = data.apps
    })
end)

RegisterNetEvent('computer:client:notify', function(type, message)
    SendNUIMessage({
        action = 'notify',
        type = type,
        message = message
    })
end)

RegisterNetEvent('computer:client:bankData', function(data)
    SendNUIMessage({action = 'bankData', data = data})
end)

RegisterNetEvent('computer:client:emailData', function(data)
    SendNUIMessage({action = 'emailData', data = data})
end)

RegisterNetEvent('computer:client:twitterData', function(data)
    SendNUIMessage({action = 'twitterData', data = data})
end)

RegisterNetEvent('computer:client:notesData', function(data)
    SendNUIMessage({action = 'notesData', data = data})
end)

RegisterNetEvent('computer:client:mdtData', function(data)
    SendNUIMessage({action = 'mdtData', data = data})
end)

RegisterNetEvent('computer:client:tokenRefreshed', function(token)
    sessionToken = token
end)

-- ===========================================
-- UTILITY
-- ===========================================

function HasValue(tbl, val)
    for _, v in ipairs(tbl) do
        if v == val then return true end
    end
    return false
end

-- Token refresh loop
CreateThread(function()
    while true do
        Wait(Config.Security.tokenExpiry * 1000 / 2)
        if isOpen and sessionToken then
            TriggerServerEvent('computer:server:refreshToken')
        end
    end
end)

-- ESC key handler
CreateThread(function()
    while true do
        Wait(0)
        if isOpen then
            DisableControlAction(0, 1, true)
            DisableControlAction(0, 2, true)
            DisableControlAction(0, 142, true)
            DisableControlAction(0, 18, true)
            DisableControlAction(0, 322, true)
            DisableControlAction(0, 106, true)
        end
    end
end)
