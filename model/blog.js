const mongoose = require('mongoose');

const blogSchema=mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    category:{
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
    },
    link:{
        type:String
    }
},{
    timestamps: true
})

const blog=mongoose.model('blog',blogSchema)

module.exports=blog