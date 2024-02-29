const mongoose = require('mongoose');

const blogSchema=mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    image:{
        type:String,
        require:true
    },
    detils:{
        type:String,
        require:true
    },
    codeExample:{
        type:String,
        require:true
    }
},{
    timestamps: true
})

const blog=mongoose.model('blog',blogSchema)

module.exports=blog