const express =require("express");
const wrapAsync = require("../utils/wrapAsync");
const router= express.Router();
const passport = require("passport");
const {saveUrl}= require("../middleware.js")
const userController = require("../controllers/user.js")


router.get("/signup",userController.renderSignupform)


router.post("/signup",wrapAsync(userController.signUp))

router.get("/login",userController.renderLoginform)

router.post("/login",saveUrl,passport.authenticate("local",
    { failureRedirect: '/login',failureFlash:true }),
    userController.login)

router.get("/logout",userController.logout)




module.exports = router;

