var express=require('express')
var app=express()
var http=require('http').Server(app)
var io=require('socket.io')(http)
var path=require('path')
var router=require('./routes/router.js')
var bodyParser=require('body-parser')
var session=require('express-session')

app.engine('html',require('express-art-template'))

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/node_modules/',express.static(path.join(__dirname,'node_modules')))
app.use('/public/',express.static(path.join(__dirname,'public')))

app.use(router)

io.on('connection',function(socket){   /*服务端socket只能在服务器启动时监听连接*/
    console.log('a user connected')
    socket.on('chat message',function(message){   //监听客户端消息
        io.emit('chat message',message)     //向所有客户端广播消息信息
    })
})

http.listen(5000,function(){
    console.log('server is runing')
})