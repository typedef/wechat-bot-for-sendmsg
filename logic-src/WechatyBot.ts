
import { Wechaty ,UrlLink      } from 'wechaty'
import { PuppetPadplus } from 'wechaty-puppet-padplus'
import { generate      } from 'qrcode-terminal'
const {
  FileBox
} = require('file-box')

const redis = require('./redis')
const token = 'puppet_padplus_1f5b8c266ea79d3b'

const puppet = new PuppetPadplus({
  token,
})

const name  = 'HelloWorld'

const bot = new Wechaty({
  puppet,
  name, // generate xxxx.memory-card.json and save login data for the next login
})

interface MyMsgObj {
  msgtxt  : string;
  msgurl  : string;
  msgimg  : string;
  msgtitle: string ;
  msgsubtitle?: string;
  msgprice?   : string;
  wechatroom? : string;
  skudata ? : {
    size ?:string;
    color?: Array<{url:string; name:string}>;    
  };
  from ?      : string;
  local?      : string
}

bot
  .on('scan', (qrcode) => {
    generate(qrcode, {
      small: true
    })
  })
  .on('message', msg => {
    console.log(`msg : ${msg}`)
    // sayInRoom('wechaty', )
  })
  .on('login', (user)=>{
    console.log(`User ${user} logined`)

    redis.connectRedis(onMessageLogic, 'message_channel')
  })
  .on('logout', (user) => {
    console.log(`${user} logout`)
  })
  .start()


  function onMessageLogic(channel : string, msg : any)
  {
      console.log('----------', channel, msg)
      if(channel == 'message_channel')
      {
        try {
          let  jsonObj : MyMsgObj = eval("(" + msg + ")");
          console.log(jsonObj)
          let topicName = jsonObj.wechatroom ? jsonObj.wechatroom : 'wechat-bot'
          sayInRoom(topicName, jsonObj)  
        } catch (error) {
          console.log(error)
        }
      }        
  }


  async function sayInRoom(topicValue:string, jsonObj:MyMsgObj) {
    const room =  await bot.Room.find({topic: topicValue })
    // 1. Send text inside Room
    if(room)
    {  
      if(jsonObj.msgurl)
      {
        if (!jsonObj.from)
        {
          console.log('msgurl--->>', jsonObj)
          let txt = jsonObj.msgtxt 
          if (jsonObj.msgprice)
              txt = txt +','+ jsonObj.msgprice

          const linkPayload = new UrlLink({
            description :  txt || ' 天猫',
            thumbnailUrl: jsonObj.msgimg || 'http://victory-home.oss-cn-shanghai.aliyuncs.com/logo108108.png',
            title       : jsonObj.msgtitle || '天猫',
            url         : jsonObj.msgurl, 
          })
          console.log('linkpayload===>>>', linkPayload)
          let ret = await room.say(linkPayload) 
          console.log('ret==>>>', ret)  
        }
        else
        {
          await room.say(jsonObj.msgurl)
        }
      }
      
      if (jsonObj.from)
      {
        if(jsonObj.msgtxt)
        await room.say(jsonObj.msgtxt)
      
        if(jsonObj.msgimg && jsonObj.msgimg != 'https://static.shop.58victory.com/')
        {
          const url = jsonObj.msgimg
          const fileBox1 = FileBox.fromUrl(url)
          await room.say(fileBox1)
        }
      }

      // 4. Send text inside room and mention @mention contact
      // const members = await room.memberAll() // all members in this room
      // const someMembers = members.slice(0, 3);
      // await room.say('Hello world!', ...members)

      // 5. send Link inside room
      // const linkPayload = new UrlLink({
      //   description : 'WeChat Bot SDK for Individual Account, Powered by TypeScript, Docker, and Love',
      //   thumbnailUrl: 'https://avatars0.githubusercontent.com/u/25162437?s=200&v=4',
      //   title       : 'Welcome to Wechaty',
      //   url         : 'https://github.com/chatie/wechaty',
      // })
      // await room.say(linkPayload)
    }
    else
    {
      console.log('not found room by topic ', topicValue)
    }
  }
