const mongoose=require('mongoose');
const schema=new mongoose.Schema({
    name:{
        type:String,
    },
    contacts:[{
        type:Number,
        
    }],
    address:{
        type:String,
    },
    age:{
        type:Number,
    },
    vechiles:[{
        type:String,
    }],
    image:{
        type:String,
    },
    assignedVehicle: {
        type: String, // Example: "Bus No. 5"
    },
    experience: {
        type: Number, // Number of years of experience
        required: true
    },



})
module.exports=mongoose.model('Driver',schema);