const express=require('express');
const mongoose=require('mongoose');
const photos=new mongoose.Schema({
    image:{
        type:String,
        
    },
    caption:{
        type:String,
    }

})
module.exports=mongoose.model('images',photos);