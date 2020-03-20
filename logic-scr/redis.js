var redis = require("redis")
var bluebird = require("bluebird")
var config = require('./config');

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
var client = null
var client1 = null

function connectRedisFunc(callback, channelName) {
  client = redis.createClient(config.REDIS_PORT, config.REDIS_HOST, {});
  client1 = redis.createClient(config.REDIS_PORT, config.REDIS_HOST, {});
  client.on("connect", function () {
    console.log("RedisServer is connected!");
  });
  client1.on("connect", function () {
    initSubscribes(callback, channelName)
  });
  //错误监听？  
  client.on("error", function (err) {
    console.log("Error " + err);
  });
}

function getParamFunc(key, callback = null) {
  client.getAsync(key).then(function (res) {
    if (callback) {
      callback(res)
    }
  });
}

function setParamFunc(key) {
  client.set(key, '1', redis.print);
}

function disconnectRedisFunc() {
  client.quit();
  client.on("end", function () {
    console.log("RedisServer is end!");
  });
  //监听取消订阅事件
  client1.on("unsubscribe", function (channel, count) {
    console.log("client unsubscribed from" + channel + ", " + count + " total subscriptions")
  });
  client1.quit();
  client1.on("end", function () {
    console.log("RedisServer is end!");
  });
}

function initSubscribes(callbackFunc, channelName) {
  //客户端连接redis成功后执行回调
  client1.on("ready", function () {
    //订阅消息
    client1.subscribe(channelName);
    // client1.subscribe('message_channel');
  }
  );

  client1.on("error", function (error) {
    console.log("Redis Error " + error);
  });

  //监听订阅成功事件
  client1.on("subscribe", function (channel, count) {
    console.log("client subscribed to " + channel + "," + count + " total subscriptions");
  });
  //收到消息后执行回调，message是redis发布的消息
  client1.on("message", callbackFunc);
}

function publishFunc(channel, msg){

  client.publish(channel, msg)
}
function incrFunc(params) {
  client.incr(params)
}
module.exports = {
  connectRedis: connectRedisFunc,
  disconnectRedis: disconnectRedisFunc,
  getParam: getParamFunc,
  setParam: setParamFunc,
  publish:publishFunc,
  incr:incrFunc
}
