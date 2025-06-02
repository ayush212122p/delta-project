if(process.env.NODE_ENV !== "production") {
require('dotenv').config()
}

const express=require("express");
const app= express();
const mongoose =require("mongoose");
const path =require("path");
const MethodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const expressError=require("./utils/expressError.js");
const listingRoutes = require("./routes/listing.js");
const reviewsRoutes = require("./routes/review.js");
const userRoutes = require("./routes/user.js")
const flash = require("connect-flash");
const Session = require("express-session");
const MongoStore = require('connect-mongo');

const passport = require("passport");
const LocalStratgy= require("passport-local");
const User= require("./models/user.js")

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(MethodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")))



// app.get("/",(req,res)=>{
//     res.send("success");
// });

const dburl = process.env.ATLASdb_URL;
const store = MongoStore.create({
  mongoUrl: dburl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
})

store.on("error",()=>{
    console.log('Error in Mongo Session Store',err);
    
})

app.use(Session({
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
    expires:Date.now() + 7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true,
    }

}))

app.use(flash())

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStratgy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
     res.locals.error=req.flash("error");
     res.locals.currentUser=req.user;
    next();
});

// app.get("/fake", async(req,res)=>{
//     let newUser= new User({
//         email:"ayush@gmail.com",
//         username:"ayush212122p",
//     });
//   let newReg= await User.register(newUser,"hello123");
//   res.send(newReg)
// })



// const Mongo_URL= 'mongodb://127.0.0.1:27017/wonderlust';


 
main().then(()=>{
    console.log('Database is connected');
    
 }).catch((err)=>{
    console.log(err);
    
 })

async function main(){
    await mongoose.connect(dburl);
}


app.use("/listing",listingRoutes)
app.use("/listing/:id/reviews",reviewsRoutes)
app.use("/",userRoutes)
app.all("*",(req,res,next)=>{
    next(new expressError(404,"Page Not Found!"));
});

app.use((err,req,res,next)=>{
    let {status= 500, message="Something went wrong!"}=err;
   res.status(status).render("./listings/error.ejs",{message});
});

app.listen(8080,()=>{
    console.log("Server is running on port 8080");
});