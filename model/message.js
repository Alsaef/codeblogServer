const mongoose = require('mongoose');

const messageScheme=mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    roomId:{
        type:String,
        require:true
    },
    MessageContent:{
        type:String,
        require:true
    },
    sendDate:{
        type:Date,
        require:true
    }
},{
    timestamps: true
})

const message=mongoose.model('message',messageScheme)

module.exports=message