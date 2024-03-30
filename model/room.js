const mongoose = require('mongoose');

const roomSchema=mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    role:{
        type:String,
        require:true
    },
},{
    timestamps: true
})

const room=mongoose.model('room',roomSchema)

module.exports=room