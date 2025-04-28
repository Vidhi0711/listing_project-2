const express=require('express');
const router=express.Router();
const User=require('../models/usermodel.js');
const passport=require("passport");
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
router.get('/signup',async (req,res)=>{
    res.render('../views/signup.ejs')
})
router.post("/signup" ,async (req,res)=>{
    try{
    let{username,password,email}=req.body;
    console.log(req.body);
    //save user to database
    const newUser= new User({
        username:username,
       
        email:email,
    })
    const registered=await User.register(newUser,password);
    console.log(registered);
    req.login(registered,(err)=>{
        if (err){
          console.log(err);
        }
      //  req.flash("success"," regitered successfully");
    res.redirect("/class");
    })
    console.log("login k abth");
    
    }
    catch(err){
       // req.flash("error", err.message);
        res.redirect("/user/signup")
    }

})
router.get("/login",(req,res)=>{
    res.render('../views/login.ejs');
})
router.post("/login", 
    passport.authenticate("local", {
        successRedirect: "/class",
        failureRedirect: "/user/login",
        failureFlash: true
    })
    ,async (req,res)=>{
        res.send("req.body");
    }

    
);
router.get("/logout",(req,res)=>{
    req.logout((err)=>{
        if (err){
       //  return    next(err);
       console.log("error");
        }
        req.flash("success","Logged Out Successfully");
        res.redirect("/class");
    })
    
})
module.exports=router;