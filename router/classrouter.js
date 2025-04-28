const express=require('express');
const router=express.Router();
const ClassModel=require('../models/classmodel.js');
const Student=require('../models/studentmodel.js');
const User=require('../models/usermodel.js')
const mongoose=require('mongoose');
const controlllers=require('../controllers/class.js');
const flash=require('connect-flash');
//console.log(controlllers);
const{home,newClassform,newClassmethod,classdetails,newStudentform,newStudentmethod
    ,classEditform,classDelete,classEditmethod
}= require('../controllers/class.js');

router.get('/' ,home);
router.get("/newclass",async (req,res)=>{
    if (!req.isAuthenticated()){
        req.flash("error","you must be logged in to do that");
        console.log(req.flash("error","you must be logged in to"));
        console.log(req.user.role);
        return res.redirect("/user/login");
    }
    if (req.user.role!="admin"){
        req.flash("error","you are not admin take permission from the admin");
        return res.redirect("/user/login");
        
    }
    console.log("kuch ");
    console.log(req.user.role);

    res.render('../views/newclass.ejs');});



router.post("/newclass",newClassmethod);
router.get("/:id/newstudent",async (req,res)=>{
    if (!req.isAuthenticated()){
        console.log("You must be logged in to do that");
        req.flash("error","you must be logged in to do that");
        return res.redirect("/user/login");
    }
    if (req.user.role!="admin"){
        req.flash("error","you are not admin take permission from the admin");
        return res.redirect("/user/login");
        
    }
    let {id}=req.params;
    console.log(id);
    const Class=await ClassModel.findById(id);
    console.log(Class);
    res.render("../views/newstudent.ejs",{Class,id});
});
router.post("/:id/newstudent",async (req,res)=>{
    if (!req.isAuthenticated()){
        console.log("You must be logged in to do that");
        req.flash("error","you must be logged in to do that");
        return res.redirect("/user/login");
    }
    if (req.user.role!="admin"){
        req.flash("error","you are not admin take permission from the admin");
        return res.redirect("/user/login");
        
    }
    let {id}=req.params;
   
    let {name,rollNo,age,gender,address,fathername,mothername,dateOfBirth,parentcontact,grade,password, username , email}=req.body;
   // console.log(gender);
   let className=id;
    let newstudent=await Student.insertOne({id:id,name:name,rollNo:rollNo,age:age,gender:gender,address:address,fathername:fathername,mothername:mothername,dateOfBirth:dateOfBirth,parentcontact:parentcontact,grade:grade,className:className,password:password,email:email,username:username});
    const newUser=new User({
        username:username,
       role:'student',
        email:email,
        studentId:newstudent._id,

    })
    let reg=await User.register(newUser,password);
 //   console.log(newstudent);
  //  console.log(id);
        res.redirect(`/class/${id}/students`);
     //   console.log(id);

});
router.get("/:id/students",async (req,res)=>{
    if (!req.isAuthenticated()){
        console.log("You must be logged in to do that");
        req.flash("error","you must be logged in to do that");
        return res.redirect("/user/login");
    }
   
  let {id}=req.params;
  const students = await Student.find({ className: new mongoose.Types.ObjectId(id) });
  const Class=    await ClassModel.findById(id);
  res.render("../views/classdetail.ejs",{students,Class});
   
});
router.get("/:id/edit",async (req,res)=>{
    if (!req.isAuthenticated()){
        console.log("You must be logged in to do that");
        req.flash("error","you must be logged in to do that");
        return res.redirect("/user/login");
    }
    if (req.user.role!="admin"){
        req.flash("error","you are not admin take permission from the admin");
        return res.redirect("/user/login");
        
    }
    let {id}=req.params;
    const editclass=await ClassModel.findById(id);
    console.log(editclass);
    res.render("../views/editclass.ejs",{editclass});
});
router.delete("/:id/delete",async (req,res)=>{
    if (!req.isAuthenticated()){
        console.log("You must be logged in to do that");
        req.flash("error","you must be logged in to do that");
        return res.redirect("/user/login");
    }
    if (req.user.role!="admin"){
        req.flash("error","you are not admin take permission from the admin");
        return res.redirect("/user/login");
        
    }
    let {id}=req.params;

    let deletedClass=await ClassModel.findByIdAndDelete(id);
    console.log(deletedClass);



   // alert("you really want to delete this class? it will premanetly be delted ");
    res.redirect("/class");


});
router.put("/:id/edit",async (req,res)=>{
    if (!req.isAuthenticated()){
        console.log("You must be logged in to do that");
        req.flash("error","you must be logged in to do that");
        return res.redirect("/user/login");
    }
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

});

module.exports=router;