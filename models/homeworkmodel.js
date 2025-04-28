const mongoose=require('mongoose');
const homework=new mongoose.Schema({
    createdAt:{
        type:Date,
        default:Date.now,
    }
    ,
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User',
        
    },
    className:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Class',
    },
    description:{
        type:String,
        required:true,
    }


})
module.exports=mongoose.model('homework', homework);