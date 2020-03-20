var config = require('./config');

var g_connection = null
function connectFunc() {
    var mysql = require('mysql');
    g_connection = mysql.createConnection({
        host: config.HOST,
        user: config.USER,
        password: config.PASSWORD,
        database: config.DATABASE,
        charset:config.CHARSET
    });
    g_connection.connect();
}

function disconnectFunc(){
    g_connection.end();
    console.log('disconnect mysql....')
}

function selectFunc(params) {
    //查
    var sql = 'SELECT * FROM '+config.TABLE;
    g_connection.query(sql, function (err, result) {
        if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            return;
        }
    });
}

function addFunc(fromRoom,fromUser,messText,messImage,md5code,callback=null) {
    //增 
    // process.env.TZ = 'Asia/Shanghai';
    var times =  parseInt((new Date()).getTime()/1000);
    var addSql = 'INSERT INTO '+config.TABLE+'(room,fromUser,messageText,messageImage,created_at) VALUES(?,?,?,?,?)';
    var addSqlParams = [fromRoom,fromUser, messText, messImage, times];

    g_connection.query(addSql, addSqlParams, function (err, result) {
        if (err) {
            console.log('[INSERT ERROR] - ', err.message);
            return;
        }
        console.log('mysql add success:',result.insertId)
        if(callback){
            callback(md5code)
        }
    });
}

function insertFunc(query)
{

    // console.log('query===', query)
    g_connection.query(query, (err, result)=>{
        if(err){
            console.log('[INSERT ERROR] - ', err.message);
            return;
        }
        console.log('mysql add success:',result.insertId)
    })
}

module.exports = {
    connect: connectFunc,
    disconnect: disconnectFunc,
    select: selectFunc,
    add:insertFunc
}