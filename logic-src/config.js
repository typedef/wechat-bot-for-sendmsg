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


var DiscordHookURL      =  'https://discordapp.com/api/webhooks/664239355027652618/kSTqLydQxkJrufUWygPLEvWB8YrwR8Tg-6IKLv_JopOpSkJoWi05Mlc7zL2bil57RSSr'
var TmallDiscordHookURL = 'https://discordapp.com/api/webhooks/651534606398652450/EXCA2E-mmNgNSMbPUayDPHBnZJ7YEuAQKjOcpJX67DjedAY1uJYXDdTjk0fwKSYUzoGS'

var DiscordWebHookTab = {
   'US':'https://canary.discordapp.com/api/webhooks/673170086798032917/ukfYnccy8BXoVsGkDYpubYh-8byr4zC2Scqx_di1jZrhg3NX90zqwfrr6k2ok0auIHp1',
   'UK':'https://canary.discordapp.com/api/webhooks/674188623146647552/8_Oy3HSETsQVNeY7BDvxxzAmNXFZIMi9DjVAPApHjtY48gKnmZy5GilruDSduvKdCNyZ',
   'AU':'https://canary.discordapp.com/api/webhooks/674189161149890561/nKNltW4vHs3PAD8eNXXCsgq6ayssg7NJorztV6U-Fiq6oRkPqX4mIMlkaABHDEc5pzum',
   'CA':'https://canary.discordapp.com/api/webhooks/674189232671293440/j6UB3hPv6Od3SZ3ZLG9BKwjWzVaW95Cps7bPPwD9W6ZcCo_JdRNc3n2QA07tJj4qWksx',
   'SG':'https://canary.discordapp.com/api/webhooks/674189274937294869/H1MEuOAfkXggONAbHhoT58iHKGvUxFzARVR68CgMqWMspIMElyhf_fOawEgPGBdSWImtOX',
   'HK':'https://canary.discordapp.com/api/webhooks/674189313847590912/huXmX8G9WhShktW1oNiTCWNz47a93Rb3-TwGMgZMfSVgG8aqYpUUPKREaYzJgyhbyAP5'
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