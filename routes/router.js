var express = require('express')
var router = express.Router()
var users=require('../public/javascripts/user-db')

router.get('/',function(request, response){
    return response.render('login.html')
})

router.get('/chat',function(request,response){
    if(request.session.user){
        return response.render('chat.html',{
            template1: '{{each messages}}',
            template2: '{{$value.name}}',
            template3: '{{$value.message}}',
            template4: '{{/each}}',
            template5: '{{if $value.name===username}}',
            template6: '{{else}}',
            template7: '{{/if}}',
            template8: '{{each userList}}',
            template9: '{{$value}}',
            template10: '{{/each}}',
            user: request.session.user
        })
    }
    else{
        return response.redirect('/')
    }
})

router.get('/register',function(request, response){
    return response.render('register.html')
})

router.post('/register',function(request, response){
    users.findOne({
        $or: [
            {
                name: request.body.name
            },
            {
                email: request.body.email
            }
        ]
    },function(err,data){
        if(err){
            return response.json({
                err_code: 500,
                message: 'server error'
            })
        }
        else if(data){
            return response.json({
                err_code: 1,
                message: 'user name or email already exists'
            })
        }
        else {
            new users(request.body).save(function(err,data){
                if(err){
                    return response.json({
                        err_code: 500,
                        message: 'server error'
                    })
                }
                else {
                    request.session.user=data
                    return response.json({
                        err_code: 0,
                        message: request.session.user.name   //返回用户名信息以用于重定向进入chat页面时向服务端发送用户信息
                    })
                }
            })
        }
    })
})

router.post('/login',function(request,response){
    users.findOne({
        name: request.body.name,
        email: request.body.email,
        password: request.body.password
    },function(err,data){
        if(err){
            response.json({
                err_code: 500,
                message: 'server error'
            })
        }
        else if(!data){
            response.json({
                err_code: 1,
                message: 'name or password is wrong'
            })
        }
        else {
            request.session.user=data
            response.json({
                err_code: 0,
                message: 'login success'
            })
        }
    })
})

router.get('/logout', function(request,response){
    delete request.session.user
    return response.redirect('/chat')
})


/*io.on('connection',function(socket){
    socket.on('name',function(name){
        console.log(name+'connected')
        socket.on('chat message',function(msg){
            console.log(msg)
            io.emit('chat message',{name: name, message: msg})
        })
    })
})*/

module.exports=router
