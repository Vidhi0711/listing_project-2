const mongoose=require('mongoose');

const schema=new mongoose.Schema({
    className:{
        type:String,
        required:true,
    },
    classTeacher:{
        type:String,
    },
    students:{
        type:Number,
        required:true,
        default:40,
    },
    courses:{
        type:Array,
        default:['maths , sciene , chemistry ']

    }
});
const Class=mongoose.model('Class', schema);
module.exports=Class;