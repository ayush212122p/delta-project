let User=require("../models/user.js");

module.exports.renderSignupform = (req,res)=>{
    res.render("./users/signup.ejs")

};

module.exports.signUp = async(req,res)=>{
    try{
        let {username,email,password} = req.body;
    let user = new User({username,email})
 let register =  await User.register(user,password);
 console.log(register);
 req.login(register,(err)=>{
    if(err){
        return next(err)
    }
req.flash("success","Welcome to Wonderlust!");
 res.redirect("/listing")
 })
 }catch(e){
   req.flash("error",e.message);
   res.redirect("/signup")
 }
};

module.exports.renderLoginform = (req,res)=>{
    res.render("./users/login.ejs")
};

module.exports.login = (req,res)=>{
    req.flash("success",`Welcome back ${req.user.username}!`);
    res.redirect(res.locals.redirectUrl || "/listing");
};

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Logged out successfully..")
        res.redirect("/listing");
    });
}