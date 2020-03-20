import { exists } from "fs";

const webhook = require("webhook-discord");

var config = require('./config');
const redis = require('./redis')
const webhookDC = require('./webhookBuild')

interface MyMsgObj {
    msgtxt : string;
    msgurl: string;
    msgimg : string;
    msgtitle: string ;
    msgsubtitle?: string;
    msgprice? : string;
    wechatroom?: string;
    skudata ? : {
        size ?: string;
        color?: string;   
        style?: string; 
    };
    from ?:string;
    local ?:string;
  }

const Hook = new webhook.Webhook(config.DiscordHookURL);

const TMallHook = new webhook.Webhook(config.TmallDiscordHookURL)

interface WebHookArrayTT { 
    [index:string]: any 
 } 

// var WebHookArrayValue = <WebHookArrayTT>{} ;
let hookList = config.DiscordWebHookTab
// for(const key of Object.keys(hookList)) {
// if(hookList.hasOwnProperty(key)) {
//         console.log(key, hookList[key]);
//         WebHookArrayValue[key] = new webhook.Webhook(hookList[key])
//     }
// }


console.log('start ........ DiscordApp Bot')

 redis.connectRedis(onMessageLogic, 'discordapp_channel')

function sayInDiscordApp( jsonObj : MyMsgObj)
{
    const msg = new webhook.MessageBuilder()
                    .setName("Glorynotify-bot")
                    .setColor("#aabbcc")
                    .setTime();
    if(jsonObj.msgtxt)
        msg.addField('goodName', '**'+jsonObj.msgtxt+'**')

    if(jsonObj.msgsubtitle)
        msg.addField('goodSubName', '**'+jsonObj.msgsubtitle+'**')

    if(jsonObj.msgprice)
        msg.addField('price', '**'+jsonObj.msgprice+'**') 

    if(jsonObj.msgurl)
        msg.addField('link', jsonObj.msgurl)

    

    if (jsonObj.skudata)
    {
        let size  = jsonObj.skudata.size
        // let color = jsonObj.skudata.color
        msg.addField('size', '**'+size+'**')  
    }
    else if (jsonObj.msgimg !='')
    {
        msg.setImage(jsonObj.msgimg);
    }

    msg.setTime()

    let local = jsonObj.local || ''
    if (local){
        // let hook = WebHookArrayValue[local]
        // hook.send(msg)
    }
    else if (!jsonObj.from && TMallHook)
        TMallHook.send(msg)
    else
        Hook.send(msg)
}

function sendMsg(jsonObj : MyMsgObj){
    let local = jsonObj.local || ''
    if (local){
        let hookUrl = config.DiscordWebHookTab[local]
        webhookDC.sendMsgToDC(hookUrl, jsonObj)
    }
    else
    {
        sayInDiscordApp(jsonObj)
    }
}

function onMessageLogic(channel : string, msg : any)
{
    console.log('----------', channel, msg)
    if(channel == 'discordapp_channel')
    {
        try {
            let  jsonObj : MyMsgObj = eval("(" + msg + ")");
            console.log(jsonObj)
            sendMsg(jsonObj)
        }
        catch (error) {
            console.log(error)
        }
    }   
}

console.log('end -------------over----------')


