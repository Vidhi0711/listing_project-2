const express=require('express');
const router=express.Router();
const ClassModel=require('../models/classmodel.js');
const Student=require('../models/studentmodel.js');
const mongoose=require('mongoose');
module.exports.home=async (req,res)=>{
    const allclass =await ClassModel.find({});
  //  console.log(allclass);
    res.render('../views/classes.ejs',{allclass});
}
module.exports.newClassform=async (req,res)=>{
    res.render('../views/newclass.ejs');
}
module.exports.newClassmethod=async (req,res)=>{
    if (req.user.role!="admin"){
        req.flash("error","you are not admin take permission from the admin");
        return res.redirect("/user/login");
        
    }
    let  {className:classe ,classTeacher:Teacher,courses:course, students:student}=req.body;
 //   console.log(req.body);
    let  newClass=new ClassModel({className:classe,classTeacher:Teacher,courses:course,students:student})
   let result =await newClass.save();
    console.log(result);
    res.redirect("/class");
}
module.exports.classdetails=async (req,res)=>{
    
  let {id}=req.params;
  const students = await Student.find({ className: new mongoose.Types.ObjectId(id) });
  const Class=    await ClassModel.findById(id);
  res.render("../views/classdetail.ejs",{students,Class});
   
}
module.exports.newStudentform=async (req,res)=>{
    if (req.user.role!="admin"){
        req.flash("error","you are not admin take permission from the admin");
        return res.redirect("/user/login");
        
    }
    let {id}=req.params;
    console.log(id);
    const Class=await ClassModel.findById(id);
    console.log(Class);
    res.render("../views/newstudent.ejs",{Class,id});
}
module.exports.newStudentmethod=async (req,res)=>{
    if (req.user.role!="admin"){
            req.flash("error","you are not admin take permission from the admin");
            return res.redirect("/user/login");
            
        }
    let {id}=req.params;
   
    let {name,rollNo,age,gender,address,fathername,mothername,dateOfBirth,parentcontact,grade}=req.body;
   // console.log(gender);
   let className=id;
    let newstudent=await Student.insertOne({id:id,name:name,rollNo:rollNo,age:age,gender:gender,address:address,fathername:fathername,mothername:mothername,dateOfBirth:dateOfBirth,parentcontact:parentcontact,grade:grade,className:className});
    const newUser=new User({
        username:name,
        email:'anand',
        role:'student',
        studentId:newstudent._id,

    })

   const registerdUser=await User.register(newUser,Password);
 //   console.log(newstudent);
  //  console.log(id);
        res.redirect(`/class/${id}/students`);
     //   console.log(id);

}
module.exports.clasEditform=async (req,res)=>{
    if (req.user.role!="admin"){
        req.flash("error","you are not admin take permission from the admin");
        return res.redirect("/user/login");
        
    }
    let {id}=req.params;
    const editclass=await ClassModel.findById(id);
    console.log(editclass);
    res.render("../views/editclass.ejs",{editclass});
}
module.exports.classDelete=async (req,res)=>{
    if (req.user.role!="admin"){
            req.flash("error","you are not admin take permission from the admin");
            return res.redirect("/user/login");
            
        }
    let {id}=req.params;
    let result = confirm("Are you sure you want to continue?");
if (result) {
    alert("You clicked OK!");
    let deletedClass=await ClassModel.findByIdAndDelete(id);
    console.log(deletedClass);
} else {
    alert("You clicked Cancel!");
}

   // alert("you really want to delete this class? it will premanetly be delted ");
    res.redirect("/class");


}
module.exports.classEditmethod=async (req,res)=>{
    if (req.user.role!="admin"){
            req.flash("error","you are not admin take permission from the admin");
            return res.redirect("/user/login");
            
        }
    let {id}=req.params;
    let  {className:classe ,classTeacher:teacher,courses:course, students:student}=req.body;
    console.log(req.body);
    let  updatedClass=await ClassModel.findByIdAndUpdate(id,{className:classe,classTeacher:teacher,courses:course,students:student},{new:true});
    console.log(updatedClass);
    res.redirect("/class");

}





