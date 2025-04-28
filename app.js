const express=require('express');
const app=express();
const { faker } = require('@faker-js/faker'); // Make sure you have faker-js installed

app.use(express.json());  
require("dotenv").config();

app.use(express.urlencoded({ extended: true }));  
const path=require('path');
//const puppeteer = require('puppeteer');
//const ejs = require('ejs');
//const path = require('path');
//const fs = require('fs');
const mongoose =require('mongoose');
const passport=require("passport");
const LocalStrategy = require("passport-local");

const ExpressError=require("./utilits/expresserror.js");

const methodOverride=require("method-override");
app.use(methodOverride("_method"));
let port=8080;
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname, "public")));
const ejsMate=require("ejs-mate");
const flash=require("connect-flash");
app.use(flash());

app.engine("ejs",ejsMate);
const MongoStore=require('connect-mongo');
const session=require("express-session");

const store=MongoStore.create({
       mongoUrl: "mongodb+srv://admin:jaihojaiho@cluster0.1i0uw.mongodb.net/school?retryWrites=true&w=majority&appName=Cluster0",
    
    crypto:{
        secret:"secret"
    },
    touchAfter:24*3600

})
store.once("error",()=>{
    console.log("error in store");
})
const sessionOption={
    store,
    secret:"secret",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
}
app.use(session(sessionOption));
app.use(passport.initialize());
app.use(passport.session());
//const multer=require("multer");
const {storage,cloudinary}=require("./cloudConfig.js");
const multer=require("multer");
const upload=multer({storage});

//const upload=multer({dest:'uploads/'});






//models
const ClassModel=require("./models/classmodel.js");
const Student =require("./models/studentmodel.js");
const Teacher=require("./models/teachermodel.js");
const Driver=require("./models/drivermodel.js");
const User=require("./models/usermodel.js");
const Notice=require("./models/noticemodel.js");
const Image=require("./models/gallerymodel.js");
const Homework=require("./models/homeworkmodel.js");

//data 
//const classdata = require("./data/classdata.js");
//const ukgdata=require("../backend/data/classstudent.js");
//const teacherdata=require("../b/data/teacherdata.js");
//const driverdata=require("../backend/data/driverdata.js");
const Class = require('./models/classmodel.js');
passport.use(new LocalStrategy(User.authenticate()));

//routers
const classRouter=require("./router/classrouter.js");
const teacherRouter=require("./router/teacherrouter.js");
const studentRouter=require("./router/studentrouter.js");
const driverRouter=require("./router/supportrouter.js");
const userRouter=require('./router/userroute.js');
const noticeRouter=require('./router/noticerouter.js');

//mongodb coonnect
const start = async () => {
    try {
        const dbURI = "mongodb+srv://admin:jaihojaiho@cluster0.1i0uw.mongodb.net/school?retryWrites=true&w=majority&appName=Cluster0";

        await mongoose.connect(dbURI, {
            serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
            socketTimeoutMS: 45000, // Increase socket timeout
         //   keepAlive: true, // Keep connection alive
        });

        console.log("✅ Connected to MongoDB");

        // Handle connection events
        mongoose.connection.on("error", (err) => {
            console.error("❌ MongoDB Connection Error:", err);
        });

        mongoose.connection.on("disconnected", () => {
            console.warn("⚠️ MongoDB Disconnected. Attempting to reconnect...");
        });

    } catch (error) {
        console.error("❌ Error connecting to MongoDB:", error);
    }
};

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.set("views" ,path.join(__dirname,"views"));


app.listen(port ,(err,res)=>{
    console.log(`Server is running on port `);

});
app.use((req,res,next)=>{
    console.log("User from req:", req.user); // D
     res.locals.success=req.flash('success');
     res.locals.error=req.flash('error');
     res.locals.currentUser=req.user||null;
    next();
 })
app.get("/" ,(req,res)=>{
    res.render('../views/index.ejs');

});



app.use("/class",classRouter);
app.use("/class/students",studentRouter);

app.use("/teachers", teacherRouter);
//app.use("/class/student",studentRouter);
app.use("/suppoters",driverRouter);
app.use("/user",userRouter);
app.use("/notices",noticeRouter);
//data upload to gallery 
const imagedata=async ()=>{
    try{
        const newGallery=new Image({
            image:"https://media.istockphoto.com/id/2075583750/photo/group-of-indian-village-students-in-school-uniform-sitting-in-classroom-doing-homework.jpg?s=2048x2048&w=is&k=20&c=RSEGCznPKpiry2tO9re6t4yhm4SsaMyDTlsNoCsIAcc=",
            caption:"classimage"
        })
        const ans=await newGallery.save();
        console.log(ans);
    }
    catch(err){
        console.log(err);
    }
}
//imagedata();
app.get("/school/gallery", async (req,res)=>{
    try{
    const images=await Image.find({});
    res.render('../views/schoolgallery.ejs',{images});}
    catch(err){
        console.log(err);
    }
    
    
})
app.get("/school/gallery/upload",async (req,res)=>{
    if (!req.isAuthenticated()){
        req.flash('error',"You must be logged in to add homework");
        return res.redirect('/user/login');
    }
    if (req.user.role=='student'){
        req.flash('error', 'you must be logged in as a admin or teacher');
        return res.redirect('/user/login');
    }
    res.render('../views/newphoto.ejs');
})
app.post("/gallery/upload",upload.single("image"), async (req,res)=>{
    if (!req.isAuthenticated()){
        req.flash('error',"You must be logged in to add homework");
        return res.redirect('/user/login');
    }
    if (req.user.role=='student'){
        req.flash('error', 'you must be logged in as a admin or teacher');
        return res.redirect('/user/login');
    }
    try{
        console.log("request coming");
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }
        console.log("req.file:", req.file);
        console.log("req.body:", req.body);
        let url=req.file.path;
        console.log(url);
        const newGallery=new Image({
            image:url,
            caption:req.body.caption
        })
        const ans=await newGallery.save();
        console.log(ans);
    }
    catch(err){
        console.log(err);
    }
    res.redirect("/school/gallery");

})



//firstly teacher mean data too dalu 
//notice mean data too dalu

//datanotice();

app.get('/homework', async (req,res)=>{
    
    try{
        const classdata=await Class.find({});
        res.render('../views/homework.ejs',{classdata});

    }
    catch(err){
        console.log(err);
    }
})
const homeworkdata=async (req,res)=>{
    const newhomework=new Homework({
        className:'67d69f190ed612c9f4dac6eb',
        description:'learn and write questions  and answers form  lesson 1 ',

    })
   const r= await newhomework.save();
   console.log(r);

    
}
//homeworkdata();
app.get('/homework/:classid',async (req,res)=>{
    try{
        const {classid}=req.params;
        const homework=await Homework.find({className:classid}).populate('className').lean();
        console.log(homework);
        console.log(homework[2]);
        console.log(homework.description);
        res.render('../views/homeworkclass.ejs',{homework,classid});
    }
    catch(err){
        console.log(err);
    }
})
app.get("/homework/:classid/addhomework", async (req,res)=>{
    if (!req.isAuthenticated()){
        req.flash('error',"You must be logged in to add homework");
        return res.redirect('/user/login');
    }
    if (req.user.role=='student'){
        req.flash('error', 'you must be logged in as a admin or teacher');
        return res.redirect('/user/login');
    }
    let {classid}=req.params;
    res.render('../views/addhomework.ejs',{classid});

})
app.post("/homework/:classid/addhomework",async (req,res)=>{
    if (!req.isAuthenticated()){
        req.flash('error',"You must be logged in to add homework");
        return res.redirect('/user/login');
    }
    if (req.user.role=='student'){
        req.flash('error', 'you must be logged in as a admin or teacher');
        return res.redirect('/user/login');
    }
    let {classid}=req.params;
    const newhomework=new Homework({
        className:classid,
        description:req.body.description
    })
    const r= await newhomework.save();
    console.log(r);
    res.redirect(`/homework/${classid}`);
})
app.delete("/homework/:hid/:classid",async (req,res)=>{
    if (!req.isAuthenticated()){
        req.flash('error',"You must be logged in to add homework");
        return res.redirect('/user/login');
    }
    if (req.user.role=='student'){
        req.flash('error', 'you must be logged in as a admin or teacher');
        return res.redirect('/user/login');
    }
    try{
        const {hid,classid}=req.params;
        const r=await Homework.findByIdAndDelete(hid);
        console.log(r);
        res.redirect(`/homework/${classid}`);
    }
    catch(err){
        console.log(err);
    }
})
const letstry=async ()=>{
    const teachers=await Teacher.find({});
    
    try{
    for (let i=0 ;i<teachers.length;i++){
        let teacher=teachers[i];
       
        let Password='12345678';
        console.log(Password);
        console.log(teacher.name);

        const newUser=new User({
            username:teacher.name+teacher.name,
            email:teacher.email,
            role:'teacher',
            teacherId:teacher._id,

        })
        

       const registerdUser=await User.register(newUser,Password);
     //console.log(registerdUser);
        
        //const r=student.save();
    }
    console.log("all students password are updated");
}
    catch(err){
        console.log(err);
    }
       
}
//letstry();
const trytoregister=async (req,res) =>{
    //const r=await User.deleteMany({});
  const password="123456";
  //  const student=await Student.findOne({username:'Student203122022'});
    //console.log(student);
    try{
        const newUser=new User({
            username:'123456',
            email:'email',
            role:'admin',
           
        })
       // console.log(student.password);
        const registerdUser=await User.register(newUser,password);
        console.log(newUser);
        
    }
    catch(err){
       // req.flash("error", err.message);
       // res.redirect("/user/signup")
       console.log(err);
    }
   
 console.log("all done");
}
//trytoregister();
app.get("/school/fees",async (req,res)=>{
    if (!req.isAuthenticated()){
        req.flash("error", "you must be logged in ")
       return  res.redirect('/user/login');

    }
    try{
        console.log('jaiho')
        console.log(req.user);
        console.log('jaiho')
       
    const stdid =req.user.studentId;
    const crole =req.user.role;
    if (crole=='admin'){
        res.send("you are admin")
    }


    

    console.log(stdid);
   
    console.log("idaye?");
    const student =await Student.findById(stdid);
    if (student==null){
        res.send("your fees is not updated or you do not unregistered ");
    }
    console.log("abhi tak update ni hua")
    console.log(student);
    console.log(stdid + student);
    res.render("../views/feestemplate.ejs",{student});



}
    catch(err){
        console.log(err);
    }
})

app.get("*",(req,res,next)=>{
    next(new ExpressError(404,"pagenot found"));
    
});
app.use((err,req,res,next)=>{
    let { message = "Something went wrong", statusCode = 500 } = err;
    res.render("errro.ejs",{err,message,statusCode});
});













start();