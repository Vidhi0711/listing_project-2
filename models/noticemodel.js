const mongoose=require('mongoose');
const Notice=new mongoose.Schema({
    title:{
        type:String,
        defaultValue:"nonotice",
        
    }
    ,
    content:{
        type:String,
        required:true,

    },
    createdAt:{
        type:Date,
        default:Date.now,
    },
    updatedAt:{
        type:Date,
        default:Date.now,
    },
    
    image:{
        type:String,
        default:null,
    }
})
module.exports=mongoose.model('Notice',Notice);