var fs = require('fs');
var crypto = require('crypto');
const {
  KEYWORDS,
  NAMEKEY_WORDS,
  ADMIN_NAME
} = require('./read-config')

function md5FileFunc(path, callback) {

  fs.readFile(path, function (err, data) {
    if (err) return;
    var md5Value = crypto.createHash('md5').update(data, 'utf8').digest('hex');
    callback(md5Value);
  });

}

function md5TextFunc(data, callback) {
    var md5Value = crypto.createHash('md5').update(data, 'utf8').digest('hex');
    callback(md5Value);
}

function FilterSensitiveInfoFunc(value) {
  var flag = true
  for (var i = 0; i < KEYWORDS.length; i++) {
    //判断内容中是否包括敏感词
    if (value.indexOf(KEYWORDS[i]) != -1) {
      flag = false
      break //包含敏感词汇
    }
  }
  return flag
}

function FilterNickNameFunc(value){
    var flag = true
    for (var i = 0; i < NAMEKEY_WORDS.length; i++){
      if (value.indexOf(NAMEKEY_WORDS[i]) != -1) {
        flag = false
        break //包含敏感词汇
      }
    }
    return flag
}

function FilterAdminNameFunc(value){
  var flag = false
  for (var i = 0; i < ADMIN_NAME.length; i++){
    if (value.indexOf(ADMIN_NAME[i]) != -1) {
      flag = true
      break //是管理员
    }
  }
  return flag
}
//从<>中获取内容
function getTextFunc(str) {
  str = str.toString()
  var lenStart = str.indexOf('<')
  var lenEnd = str.indexOf('>')
  var getStr = ''
  if (lenStart > 0 && lenEnd > 0) {
    getStr = str.substring(lenStart + 1, lenEnd)
  }
  return getStr
}
//@XX [弱]  群踢人提取对象名称
function getDelContactFunc(text) {
  let index1 = text.indexOf('@')
  let index2 = text.indexOf('[弱]')
  let delContact = ''
  //发起踢人请求
  if( index1!= -1 &&  index2!= -1){
    delContact = text.substring(index1+1,index2)
    delContact = delContact.replace(/(^\s*)|(\s*$)/g, "");  
  }
  return delContact
}
module.exports = {
  md5File: md5FileFunc,
  md5Text:md5TextFunc,
  getText: getTextFunc,
  FilterSensitiveInfo: FilterSensitiveInfoFunc,
  FilterNickName : FilterNickNameFunc,
  FilterAdminName:FilterAdminNameFunc,
  getDelContact:getDelContactFunc
}
