const mongoose=require('mongoose');
const schema=new mongoose.Schema({
    name:{
        type:String,
        required:true,

    },
    rollNo:{
        type:Number,
        
    },
    className:{

        type:mongoose.Schema.Types.ObjectId,
        ref:'classes',
             
            
    }
    ,age:{
        type:Number,
        require:true,
        
    }
    ,gender:{
        type:String,
        required:true,
    },
    address:{
        type:String,

    },
    fathername:{
        type:String,

    },
    mothername:{
        type:String,
    },
    dateOfBirth:{
        type:Date,
    }
    ,image:{
        type:String,

    }
    ,
    parentcontact:[
        {
        type:Number,
    }]
    ,grade:[{
        type:String,
       
       
    }],
    attendance:[{
       type:Date, 
    }],
    fees: { type: Number, default: 0 } ,
    username:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    }
    ,
    password:{
        type:String,
        required:true,
    }
    
    

    



})
module.exports=mongoose.model('Students',schema);