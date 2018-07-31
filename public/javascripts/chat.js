var socket=io()     //连接服务器socket
var messages=JSON.parse(window.localStorage.getItem('messages'))||[]  //获取localStorage中的信息
var username=$('i').text()    //获取登陆用户信息

var ret=template('template',{
    messages: messages,
    username: username
})
$('#message-container').html(ret)

$('#send').bind({
    'submit': function(event){
        var message=$('input[type=text]').val()
        $('input[type=text]').val('')
        socket.emit('chat message', {name: username, message: message}) //向服务器广播消息信息
        event.preventDefault()
    }
})

socket.on('chat message',function(message){    //客户端监听消息事件，获取用户信息
    messages.push(message)
    window.localStorage.setItem('messages',JSON.stringify(messages))
    var ret=template('template',{
        messages: messages,
        username: username
    })
    $('#message-container').html(ret)
})
