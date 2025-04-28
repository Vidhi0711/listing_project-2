const express=require('express');
const router=express.Router();
const Notice=require('../models/noticemodel.js');
const {storage,cloudinary}=require("../cloudConfig.js");
const multer=require("multer");
const upload=multer({storage});



router.get("/",async(req,res)=>{
    const notices=await Notice.find({});
    console.log(notices);
    res.render('../views/notices.ejs',{notices});
})
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
    let notice=await Notice.findById(id);
    console.log(notice);
    res.render("../views/editnotice.ejs",{notice});
})
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
    let {title:title,content:content,createdAt:createdAt}=req.body;
    let updatedNotice=await Notice.findByIdAndUpdate(id,{title,content,createdAt},{runValidators:true}, {new:true});
     console.log(updatedNotice);
     res.redirect("/notices");
})
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
    let deletdNotice=await Notice.findByIdAndDelete(id);
    console.log(deletdNotice);
    res.redirect("/notices");
})
router.get("/typeofnotice",async (req,res)=>{
      if (!req.isAuthenticated()){
            console.log("You must be logged in to do that");
            req.flash("error","you must be logged in to do that");
            return res.redirect("/user/login");
        }
    if (req.user.role!="admin"){
            req.flash("error","you are not admin take permission from the admin");
            return res.redirect("/user/login");
            
        }
    res.render("../views/typeofnotice.ejs");
})

router.get('/addnew/simple',async (req,res)=>{
    if (!req.isAuthenticated()){
        console.log("You must be logged in to do that");
        req.flash("error","you must be logged in to do that");
        return res.redirect("/user/login");
    }
    if (req.user.role!="admin"){
        req.flash("error","you are not admin take permission from the admin");
        return res.redirect("/user/login");
        
    }
    res.render("../views/newsimplenotice.ejs");


})
router.get('/addnew/withphoto',async (req,res)=>{
    if (!req.isAuthenticated()){
        console.log("You must be logged in to do that");
        req.flash("error","you must be logged in to do that");
        return res.redirect("/user/login");
    }
    if (req.user.role!="admin"){
        req.flash("error","you are not admin take permission from the admin");
        return res.redirect("/user/login");
        
    }
    res.render("../views/newnoticephoto.ejs");
 
})
router.post('/addnew/withphoto',upload.single("image"),async (req,res)=>{
    if (!req.isAuthenticated()){
        console.log("You must be logged in to do that");
        req.flash("error","you must be logged in to do that");
        return res.redirect("/user/login");
    }
    if (req.user.role!="admin"){
        req.flash("error","you are not admin take permission from the admin");
        return res.redirect("/user/login");
        
    }
    try{
        let urlp=req.file.path;
      //  let filenamep=req.file.filename;
        
        
    let {title,content}=req.body;
   
    let newnotice=await Notice.create({title:title,content:content,image:urlp});
  
    console.log(newnotice);
    req.flash("success","new  notice created ");
    res.redirect("/notices");}
    catch(err){
        next(err);
    }
}

)
router.post('/addnew',async (req,res)=>{
    if (!req.isAuthenticated()){
        console.log("You must be logged in to do that");
        req.flash("error","you must be logged in to do that");
        return res.redirect("/user/login");
    }
    if (req.user.role!="admin"){
        req.flash("error","you are not admin take permission from the admin");
        return res.redirect("/user/login");
        
    }
    let {title:title,content:content}=req.body;
    let newNotice=new Notice({title,content});
    await newNotice.save();
    res.redirect("/notices");
})
module.exports=router;

