const express =require("express");
const router= express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const {validateReview,isLoggedin,isAuthor} = require("../middleware.js")
const reviewController = require("../controllers/review.js");


// Review Route Post

router.post("/",isLoggedin,validateReview,wrapAsync(reviewController.postReview));

// DELETE Review Route

router.delete("/:reviewID",isLoggedin,isAuthor,wrapAsync(reviewController.destroyReview));


module.exports=router;