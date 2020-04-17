//alicloud
var REGION = 'oss-cn-shanghai'
var ACCESS_KEY_ID = 'eeee'
var ACCESS_KEY_SECRET = 'xxx'
var BUCKET = 'xxx'



//redis
var REDIS_PORT = 6379
var REDIS_HOST = '127.0.0.1'

// var G_OSS_HOST = "https://static-files.58victory.com/"
var G_OSS_HOST = 'http://admin.58victory.com'


var DiscordHookURL      =  'https://discordapp.com/api/webhooks/'
var TmallDiscordHookURL = 'https://discordapp.com/api/webhooks/'

var DiscordWebHookTab = {
   'US':'https://canary.discordapp.com/api/webhooks/',
   'UK':'https://canary.discordapp.com/api/webhooks/',
   'AU':'https://canary.discordapp.com/api/webhooks/',
   'CA':'https://canary.discordapp.com/api/webhooks/',
   'SG':'https://canary.discordapp.com/api/webhooks/',
   'HK':'https://canary.discordapp.com/api/webhooks/'
}

module.exports = {
    REGION,
    ACCESS_KEY_ID,
    ACCESS_KEY_SECRET,
    BUCKET,
    REDIS_PORT,
    REDIS_HOST,
    G_OSS_HOST,
    DiscordHookURL,
    TmallDiscordHookURL,
    DiscordWebHookTab
}
