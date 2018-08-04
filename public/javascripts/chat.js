var socket=io()     //连接服务器socket
var messages=JSON.parse(window.localStorage.getItem('messages'))||[]  //默认获取localStorage中的群组信息
var username=$('i').text()    //获取登陆用户信息

var ret=template('template',{    //默认渲染信息列表
    messages: messages,
    username: username
})
$('#message-container').html(ret)

$('#message-container-2 span').text('messages')  //默认加载当前对话人信息

$('#send').bind({
    'submit': function(event){
        var to=$('#message-container-2 span').text()
        var message=$('textarea').val()
        $('textarea').val('')

        if(message!=''){
            socket.emit('chat message', {name: username, to: to, message: message}) //向服务器广播消息信息
        }
        else {
            alert('输入内容不能为空！')
        }

        event.preventDefault()
    }
})

$('.iconfont.icon-tongxunlu').bind({
    'click': function(event){
        $.ajax({
            type: 'get',
            dataType: 'json',
            url: '/getContactList',
            success: function(data){
                if(data.err===500){
                    alert('server error')
                }
                else {
                    var ret=template('friendsList', {
                        friendsList: data.message
                    })
                    $('#userList').html(ret)
                }
            }
        })
    }
})

$('.iconfont.icon-zaixianyonghu').bind({
    'click': function(event){
        var userList=JSON.parse(window.localStorage.getItem('onlineUserList of '+username))
        var ret=template('template2', {
            userList: userList
        })
        $('#userList').html(ret)

        $('li.userList').bind({   //绑定用户列表单击事件，一定要在监听事件中绑定
            'click': function(event){
                var messages=JSON.parse(window.localStorage.getItem($(this).text()))||[]
                $('#message-container-2 span').text($(this).text())   //渲染当前对话人信息

                $('li.userList').each(function(index,item){   //使当前对话用户列表项颜色加深
                    if($(item).text().trim()===$('#message-container-2 span').text().trim()){
                        $(item).css({
                            backgroundColor: '#C3C3C3'
                        })
                    }
                    else {
                        $(item).css({
                            backgroundColor: '#EEEAE8'
                        })
                    }
                })

                var ret=template('template',{     //渲染当前对话信息
                    messages: messages,
                    username: username
                })
                $('#message-container').html(ret)
                $('#message-container').scrollTop($('#message-container')[0].scrollHeight)  //让滚动条处于div最下方
            }
        })

    }
})


socket.emit('login',username)   //传递用户信息

socket.on('chat message',function(data, to){   //客户端监听消息事件，获取用户信息
    if(to==='messages'){   //群发验证
        messages.push(data)
        window.localStorage.setItem('messages',JSON.stringify(messages))
        var ret=template('template',{
            messages: messages,
            username: username
        })
        $('#message-container').html(ret)
        $('#message-container').scrollTop($('#message-container')[0].scrollHeight)  //让滚动条处于div最下方
    }
    else if(to===username){    //别人向自己发送
        var messageOther=JSON.parse(window.localStorage.getItem(data.name))||[]
        messageOther.push(data)
        window.localStorage.setItem(data.name, JSON.stringify(messageOther))
        var retOther=template('template',{
            messages: messageOther,
            username: username
        })
        $('#message-container').html(retOther)
        $('#message-container').scrollTop($('#message-container')[0].scrollHeight)  //让滚动条处于div最下方
    }
    else {       //自己发送自己接收
        var messageSelf=JSON.parse(window.localStorage.getItem(to))||[]
        messageSelf.push(data)
        window.localStorage.setItem(to, JSON.stringify(messageSelf))
        var retSelf=template('template', {
            messages: messageSelf,
            username: username
        })
        $('#message-container').html(retSelf)
        $('#message-container').scrollTop($('#message-container')[0].scrollHeight)  //让滚动条处于div最下方
    }
})

socket.on('login',function(data){   //接收用户列表事件并渲染在线用户列表
    data.splice(data.indexOf(username),1)
    window.localStorage.setItem('onlineUserList of '+username , JSON.stringify(data))
    var ret=template('template2',{
        userList: data
    })

    $('#userList').html(ret)

    $('li.userList').filter(function(index, item){    //默认使群组列表项颜色加深
        return $(item).text().trim()===$('#message-container-2 span').text().trim()
    }).css({
        backgroundColor: '#c3c3c3'
    })

    $('li.userList').bind({   //绑定用户列表单击事件，一定要在监听事件中绑定
        'click': function(event){
            var messages=JSON.parse(window.localStorage.getItem($(this).text()))||[]
            $('#message-container-2 span').text($(this).text())   //渲染当前对话人信息

            $('li.userList').each(function(index,item){   //使当前对话用户列表项颜色加深
                if($(item).text().trim()===$('#message-container-2 span').text().trim()){
                    $(item).css({
                        backgroundColor: '#C3C3C3'
                    })
                }
                else {
                    $(item).css({
                        backgroundColor: '#EEEAE8'
                    })
                }
            })

            var ret=template('template',{     //渲染当前对话信息
                messages: messages,
                username: username
            })
            $('#message-container').html(ret)
            $('#message-container').scrollTop($('#message-container')[0].scrollHeight)  //让滚动条处于div最下方
        }
    })
})
