var mongoose=require('mongoose')
mongoose.connect('mongodb://localhost/chat-socket')
var Schema=mongoose.Schema

var userSchema=new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

module.exports=mongoose.model('User',userSchema)