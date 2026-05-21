fx_version 'cerulean'
game 'gta5'

author 'Mohammad'
description 'Advanced In-Game Computer System - Windows 11 / Cyberpunk Style'
version '1.0.0'

lua54 'yes'

shared_scripts {
    'config.lua'
}

client_scripts {
    'client/main.lua'
}

server_scripts {
    '@oxmysql/lib/MySQL.lua',
    'server/main.lua'
}

ui_page 'html/index.html'

files {
    'html/index.html',
    'html/css/*.css',
    'html/js/*.js',
    'html/js/apps/*.js',
    'html/img/*.*',
    'html/sounds/*.*'
}
