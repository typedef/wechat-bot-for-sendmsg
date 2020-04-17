# WECHATY-PUPPET-PADCHAT

[![Powered by Wechaty](https://img.shields.io/badge/Powered%20By-Wechaty-blue.svg)](https://github.com/chatie/wechaty)
[![NPM Version](https://badge.fury.io/js/wechaty-puppet-padchat.svg)](https://www.npmjs.com/package/wechaty-puppet-padchat)
[![npm (tag)](https://img.shields.io/npm/v/wechaty-puppet-padchat/next.svg)](https://www.npmjs.com/package/wechaty-puppet-padchat?activeTab=versions)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-blue.svg)](https://www.typescriptlang.org/)
[![Linux/Mac Build Status](https://travis-ci.com/lijiarui/wechaty-puppet-padchat.svg?branch=master)](https://travis-ci.com/lijiarui/wechaty-puppet-padchat) [![Greenkeeper badge](https://badges.greenkeeper.io/lijiarui/wechaty-puppet-padchat.svg)](https://greenkeeper.io/)

This module is a sub module of [Wechaty Puppet](https://github.com/Chatie/wechaty/issues/1167).

## 本项目概要介绍
要解决的问题，当多客服需要管理微信群和用户的时候，需要有一个统一的管理平台，几个客服通过机器人微信给群发送统一的消息，并有记录监控。
目前的解决方案是，搭建了web管理系统，多客服发送消息，为了系统解耦，通过redis的消息频道传递消息，给wechaty-bot框架，我们设计的几个要传递的消息结构。
```ts
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
```
当然在redis频道中传递是通过string的方式来做的，铜鼓wechaty启动的时候，开启redis频道的监控，获取消息，然后解析结构体。
根据接收的消息内容，解析，并发送给你指定的群，具体消息内容的组合，将消息下发到群了。

通过wechaty -bot 后面的处理流程和逻辑是相对比较简单的。
核心代码主要是
```ts
 redis.connectRedis(onMessageLogic, 'message_channel')
 // 当wechaty启动的时候，去注册redis的监控，挂在消息监听的回调函数
```
已经使用一段时间，大的问题没法发现，但是有一个小问题，就是当同一时间消息发送频率过高的时候，会出现丢失部分消息的情况，这个问题已经反馈给wechaty研发人员，希望可以得到解决。
如果让自己来处理的消息发行的频率的话，就会增加业务逻辑的复杂度。

以下是wechaty的引入应用的方法了，取之官方文档

## INSTALL
```shell
npm install wechaty@next
npm install wechaty-puppet-padchat
```

## SOURCE

```ts
import { Wechaty } from 'wechaty'

const WECHATY_PUPPET_PADCHAT_TOKEN = 'puppet_padchat_'

const puppet = 'wechaty-puppet-padchat'
const puppetOptions = {
  token: WECHATY_PUPPET_PADCHAT_TOKEN,
}
  
const bot = new Wechaty({
  puppet,
  puppetOptions,
})

// You are all set
```

## RUN

```shell
./node_modules/.bin/ts-node examples/wechaty-padchat-bot.ts
```

Currently you can apply a Alpha Testing Padchat Token at here: [Wechaty Padchat Alpha Testing](https://github.com/Chatie/wechaty/issues/1296)

## AUTHOR

Jiarui LI <rui@chatie.io>

## LICENSE

Apache-2.0
