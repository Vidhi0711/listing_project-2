
const express=require('express');
const router=express.Router();
const ClassModel=require('../models/classmodel.js');
const Student=require('../models/studentmodel.js');
const mongoose=require('mongoose');

router.get("/:studentid/details",async (req,res)=>{
     if (!req.isAuthenticated()){
            req.flash('error',"You must be logged in to add homework");
            return res.redirect('/user/login');
        }
    let {studentid}=req.params;

        if (req.user.role=='student'){

            let cuser=req.user;
            if (cuser.studentId!=studentid){
            req.flash('error', 'you must be logged in as a same student  or teacher or admin ');
            return res.redirect('/user/login');}
            
        }

    const student = await Student.findById(studentid);
    res.render("../views/studentdetail.ejs",{student});

})
router.get("/:studentid/details/edit",async (req,res)=>{
    if (req.user.role!="admin"){
        req.flash("error","you are not admin take permission from the admin");
        return res.redirect("/user/login");
        
    }
    let {studentid}=req.params;
    const editstudent = await Student.findById(studentid);
    res.render("../views/editstudent.ejs",{editstudent});
})
router.put("/:id/details/edit",async (req,res)=>{
 
    if (req.user.role!="admin"&&req.user.role!='teacher'){
        req.flash("error","you are not admin take permission from the admin");
        return res.redirect("/user/login");
        
    }
    
    let {id}=req.params;
    let {name,rollNo,age,gender,address,fathername,mothername,dateOfBirth,parentcontact,grade}=req.body;
    let updatedstudent=await Student.findByIdAndUpdate(id,{name,rollNo,age,gender,address,fathername,mothername,dateOfBirth,parentcontact,grade},{new:true});
    console.log(updatedstudent);
    res.redirect(`/class/students/${id}/details`);
})
router.delete("/class/student/:id/details/delete",async (req,res)=>{
    let {id}=req.params;
    if (req.user.role!="admin"&&req.user.role!='teacher'){
        req.flash("error","you are not admin take permission from the admin");
        return res.redirect("/user/login");
        
    }
    
   
        let deletedStudent=await Student.findByIdAndDelete(id);
        let classid=deletedStudent.className;
        console.log(classid);
        console.log(deletedStudent);
    res.redirect(`/class/${classid}/students`);


})



module.exports=router;

