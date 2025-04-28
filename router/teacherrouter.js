const express=require('express');
const router=express.Router();
const Teacher=require('../models/teachermodel.js');
const Classmodel=require('../models/classmodel.js');

const moongoose=require('mongoose');
router.get("/", async(req,res)=>{
    const allteacher=await Teacher.find({})
    res.render("../views/teachers.ejs",{allteacher});
})
router.get("/:id/teacherdetail",async (req,res)=>{
    if (!req.isAuthenticated()){
        console.log("You must be logged in to do that");
        req.flash("error","you must be logged in to do that");
        return res.redirect("/user/login");
    }
   let {id}=req.params;
   const teacher=await Teacher.findById(id).populate({path:"classes"});
   console.log(teacher);
   res.render("../views/teacherdetail.ejs",{teacher});

})
router.get("/:classid", async (req,res)=>{
    let {classid}=req.params;
    try {
        let teachers = await Teacher.find({ classes: classid });
        console.log(teachers);
        res.render("../views/classesteacher.ejs",{teachers,classid});
    } catch (error) {
        console.error("Error fetching teachers:", error);
    }
    
    
    


})
router.get("/:classid/newteacher",async (req,res)=>{
    if (!req.isAuthenticated()){
        console.log("You must be logged in to do that");
        req.flash("error","you must be logged in to do that");
        return res.redirect("/user/login");
    }
    let {classid}=req.params;
    res.render("../views/newteacher.ejs",{classid});
})
router.post("/:classid/newteacher",async (req,res)=>{
    if (!req.isAuthenticated()){
        console.log("You must be logged in to do that");
        req.flash("error","you must be logged in to do that");
        return res.redirect("/user/login");
    }
    let {classid}=req.params;
    let {name,email,phone,address,qualification,subjects,experience,dateOfJoining}=req.body;
    let newteacher= new Teacher({name:name,email:email,phone:phone,address:address,qualification:qualification,subjects:subjects,experience:experience,dateOfJoining:dateOfJoining});
    let result =await newteacher.save();
    console.log(result);
    newteacher.classes=classid;
    let r=await newteacher.save();
    console.log(r);
    res.redirect(`/teachers/${classid}`);
})
router.get("/:id/edit",async (req,res)=>{
    if (!req.isAuthenticated()){
        console.log("You must be logged in to do that");
        req.flash("error","you must be logged in to do that");
        return res.redirect("/user/login");
    }
    let {id}=req.params;
    try {
        let teacher = await Teacher.findById(id);
        console.log(teacher);
        res.render("../views/editteacher.ejs",{teacher});
    } catch (error) {
        console.error("Error fetching teacher:", error);
    }
})
router.put ("/:id/edit",async (req,res)=>{
    if (!req.isAuthenticated()){
        console.log("You must be logged in to do that");
        req.flash("error","you must be logged in to do that");
        return res.redirect("/user/login");
    }
    let {id}=req.params;
    let {name,email,phone,address,qualification,subjects,experience,dateOfJoining}=req.body;
    let teacher= await Teacher.findByIdAndUpdate(id,{name:name,email:email,phone:phone,address:address,qualification:qualification,subjects:subjects,experience:experience,dateOfJoining:dateOfJoining},{new:true})
    console.log(teacher);
    res.redirect(`/teacher/${id}/teacherdetail`);
} )
//user 
router.delete("/:id/delete",async (req,res)=>{
    if (!req.isAuthenticated()){
        console.log("You must be logged in to do that");
        req.flash("error","you must be logged in to do that");
        return res.redirect("/user/login");
    }
    let {id}=req.params;
    try {
        let teacher = await Teacher.findByIdAndDelete(id);
        console.log(teacher);
        res.redirect(`/teachers`);
    } catch (error) {
        console.error("Error deleting teacher:", error);
    }})
module.exports=router;
