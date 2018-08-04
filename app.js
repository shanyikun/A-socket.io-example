var express=require('express')
var app=express()
var http=require('http').Server(app)
var io=require('socket.io')(http)
var path=require('path')
var router=require('./routes/router.js')
var bodyParser=require('body-parser')
var session=require('express-session')
var _=require('underscore')    //js工具包
var userList=['messages']   //用户列表
var hashName=[]      //用户名与socket.id 映射表

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

    socket.on('disconnect', function(){    //用户断开连接时删除相关用户列表，并重新渲染
        console.log('a user disconnect')
        userList.splice(userList.findIndex(function(item){
            return item===socket.name
        }),1)
        io.emit('login',userList)
    })

    socket.on('login',function(data){   //监听用户登陆事件并广播在线用户信息
        if(userList.indexOf(data)===-1){
            userList.push(data)
        }
        hashName[data]=socket.id    //关联ID与用户名
        socket.name=data         //可以不用设置name属性
        io.emit('login',userList)
    })

    socket.on('chat message',function(data){   //监听客户端消息
        if(data.to==='messages'){
            io.emit('chat message',{name: data.name, message: data.message}, 'messages')     //向所有客户端广播消息信息
        }
        else {
            var toName=data.to
            var fromName=data.name
            var toSocket = _.findWhere(io.sockets.sockets, { id: hashName[toName] })   //利用socket.id寻找特定的socket对象
            var fromSocket=_.findWhere(io.sockets.sockets, { id: hashName[fromName] })
            /*var toSocket = _.findWhere(io.sockets.sockets, { name: toName })   //也可以用自定义的name属性寻找特定的socket对象
            var fromSocket=_.findWhere(io.sockets.sockets, { name: fromName })  */
                toSocket.emit('chat message', {name: data.name, message: data.message}, data.to)  //向特定的socket用户推送消息
                fromSocket.emit('chat message', {name: data.name, message: data.message}, data.to)
        }
    })
})

http.listen(5000,function(){
    console.log('server is runing')
})