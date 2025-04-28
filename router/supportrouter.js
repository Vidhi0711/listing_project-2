const express=require('express');
const router=express.Router();
const ClassModel=require('../models/classmodel.js');
const Driver=require('../models/drivermodel.js');
const mongoose=require('mongoose');

router.get("/driver",async (req,res)=>{
    const alldriver=await Driver.find({});
    console.log(alldriver);
    res.render("../views/driver.ejs",{alldriver});
})
module.exports=router;