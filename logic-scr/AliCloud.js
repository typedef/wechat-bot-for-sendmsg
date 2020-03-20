var co = require('co');
var OSS = require('ali-oss');
var config = require('./config');


var client = new OSS({
  region: config.REGION,
  accessKeyId: config.ACCESS_KEY_ID,
  accessKeySecret: config.ACCESS_KEY_SECRET,
  bucket: config.BUCKET,
});


function  uploadOssImage(imageUrl,callback = null) {
  // imageUrl = 8980379469245044656.jpg
  co(function* () {
    let filename = 'wechaty/' + imageUrl
    client.useBucket(config.BUCKET);
    var result = yield client.put(filename, imageUrl);
    if(callback){
      callback(filename)
    }
  }).catch(function (err) {
    console.log(err);
  });
}

module.exports = {
  uploadOssImage:uploadOssImage
}