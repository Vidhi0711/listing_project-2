const mongoose=require('mongoose');
const Class=require("./classmodel.js");
const schema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
    },
    phone:{
        type:Number,
        required:true,
    }
    ,image:{
        type:String,
    }
    ,
    address:{
        type:String,
    }
    ,
    classes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Class",
    }],
    subjects:[
        {type:String}
    ],
    qualification:[
        {type:String}
    ],
    experience:[{
        type:String,
    }],
    Dateofjoining:{
        type:String,
    },
    username:{
        type:String,
        required:true,

    },
    password:{
        type:String,
        required:true,
    },
    

    





})
const Teacher=mongoose.model('Teacher',schema);
module.exports=Teacher;