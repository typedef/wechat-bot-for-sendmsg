const {
  Wechaty,
  Message,
  Contact,
  Friendship,
  Room
} = require('wechaty')
const {
  FileBox
} = require('file-box')

const WECHATY_PUPPET_PADCHAT_TOKEN = 'puppet_padchat_65a1ed1e45b40b3a'

const puppet = 'wechaty-puppet-padchat'
const puppetOptions = {
  token: WECHATY_PUPPET_PADCHAT_TOKEN,
}

const bot = new Wechaty({
  puppet,
  puppetOptions,
  name: 'plastic-v1'
})



const qrTerm = require('qrcode-terminal')
const mysql = require('./mysql')
const redis = require('./redis')
// const AliCloud = require('./AliCloud')
const util = require('./util')
var config = require('./config');
var fs = require('fs');

const baseQuery = 'INSERT INTO ' + config.TABLE + '(room,fromUser,messageText,messageImage,created_at) VALUES ';
// const QUEUE_KEY = 'QUEUE_KEY'

bot.on('scan', onScan)
bot.on('login', onLogin)
bot.on('logout', onLogout)
bot.on('message', onMessage)
// bot.on('friendship', FriendshipFunc)

bot.start()
  .then(() => console.log('Starter Bot Started.'))
  .catch(e => console.error(e))
//获取登录二维码
function onScan(qrcode, status) {
  qrTerm.generate(qrcode, {
    small: false
  }) // show qrcode on console

  const qrcodeImageUrl = [
    'https://api.qrserver.com/v1/create-qr-code/?data=',
    encodeURIComponent(qrcode),
  ].join('')
  console.log(`Scan QR Code to login: ${status}\n` + qrcodeImageUrl + `\n`)
}

//登录
function onLogin(user) {
  console.log(`User ${user} logined`)
  // 链接数据库
  mysql.connect()
  redis.connectRedis(onMessageLogic)
}

var queryList = ''
var g_timeInt = null

function onMessageLogic(channel, msg) {

  if (channel == 'message_channel') {
    let mis_time = (new Date()).getTime()
    var time = parseInt(mis_time / 1000);
    let query = msg + ',' + time + ')';

    if (queryList)
      queryList = queryList + ', ' + query
    else
      queryList = query

    if (!g_timeInt) {
      g_timeInt = setInterval(() => {
          if (queryList) {
            let cmdquery = baseQuery + queryList;
            queryList = ''
            mysql.add(cmdquery)
          }
        },
        60000
      )
    }
  } else if (channel == 'WechatyOrder') {
    redis.getParam(msg, (res) => {
      var obj = eval('(' + res + ')');
      //发送消息
      if (obj.room) {
        let imgurl = ''
        if (obj.img_url) {
          imgurl = config.G_OSS_HOST + obj.img_url
        }
        sayInRoom(obj.room, obj.fromuser, imgurl, obj.context, obj.success, obj.failed)
      }
    })
  }
  return;
}
//注销
function onLogout(user) {
  console.log(`${user} logout`)
  // 取消数据链接
  mysql.disconnect()
  redis.disconnectRedis()
}

//Message
async function onMessage(message) {
  //Message#[文本类型](👥Room<群>🗣Contact<发送方>👤Contact<接收方>)<详细内容>
  // console.log('-------------------------------')
  if ((message.type() != Message.Type.Unknown)) {
    console.log(`Message: ${message}`)
    var from = util.getText(message.from())
    var text = message.text()
    var room = message.room() //房间 
    var roomTopic = ''
    if (room) {
      roomTopic = await room.topic()
      roomTopic = roomTopic.toString()
      delContact(roomTopic, from, text) //管理员删除操作
    }


    let checkNickName = util.FilterNickName(from)
    if (!checkNickName) {
      return;
    }

    // 文本
    if (message.type() == Message.Type.Text) {

      let checkFilter = util.FilterSensitiveInfo(text) //检测敏感词汇
      if (checkFilter) {
        util.md5Text(text, (md5code) => {
          redis.getParam(md5code, (res) => {
            // console.log("text redis find res=", res)
            if (!res) {
              // let query = 'INSERT INTO '+config.TABLE+'(room,fromUser,messageText,messageImage,created_at)'+
              //   'VALUES ('+roomTopic+','+from+','+text+',\'\')';
              let query = '(\'' + roomTopic + '\',\'' + from + '\',\'' + text + '\',\'\'';
              // console.log('query====', query)  
              redis.publish('message_channel', query)
              redis.setParam(md5code)
            }
          })
        })
      }
    }
    //如果是图片或者视频
    else if (message.type() == Message.Type.Image || message.type() == Message.Type.Video) {
      const file = await message.toFileBox()
      const imgName = file.name
      const fileName = './images/' + imgName
      await file.toFile(fileName, true)

      util.md5File(fileName, (md5code) => {
        redis.getParam(md5code, (res) => {
          // console.log("img find redis res====", res)
          if (!res) {
            // let query = 'INSERT INTO '+config.TABLE+'(room,fromUser,messageText,messageImage,created_at)'+
            // 'VALUES ('+roomTopic+','+from+',\'\','+fileName+')';

            let query = '(\'' + roomTopic + '\',\'' + from + '\',\'\',\'' + fileName + '\'';
            redis.publish('message_channel', query)
            redis.setParam(md5code)
          } else {
            fs.unlink(fileName, (res) => {
              console.log('delete:', fileName, res)
            })
          }
        })
      })
    }
  }
}

async function sayInRoom(roomTopic, person, imgUrl, context, success, failed) {
  const room = await bot.Room.find({
    topic: roomTopic
  })
  
  const contact = await bot.Contact.find({
    name: person
  })
  console.log(person,contact)
  if (room) {
    if (context) {
      await room.say(context)
        .then(() => {
          redis.incr(success)
        })
        .catch(() => {
          redis.incr(failed)
        })
    }
    if (imgUrl) {
      const fileBox1 = FileBox.fromUrl(imgUrl)
      await room.say(fileBox1).then(() => {
          redis.incr(success)
        })
        .catch(() => {
          redis.incr(failed)
        })
    }
  } else {
    redis.incr(failed)
  }

}

async function delContact(roomTopic, from, text) {
  let checkAdminName = util.FilterAdminName(from) //是否管理员
  if (checkAdminName) {
    let delContact = util.getDelContact(text)
    //发起踢人请求
    if (delContact != '') {
      const room = await bot.Room.find({
        topic: roomTopic
      })
      const contact = await bot.Contact.find({
        name: delContact
      })
      if (room) {
        try {
          await room.del(contact)
        } catch (e) {
          console.error(e)
        }
      }
    }

  }
}