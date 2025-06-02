const Listing=require("./models/listing.js");
const expressError=require("./utils/expressError.js");
const {listingSchema,reviewSchema}=require("./schema.js");
const Review = require("./models/review.js")


module.exports.isLoggedin = (req,res,next)=>{
    if(!req.isAuthenticated()){
         req.session.redirectUrl= req.originalUrl;
        req.flash("error","You must be logged in");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}


module.exports.isOwner = async(req,res,next)=>{
     let {id}=req.params;
        let listing = await Listing.findById(id);
        if(!listing.owner._id.equals(res.locals.currentUser._id)){
            req.flash("error","You don't have permission to do that");
            return res.redirect(`/listing/${id}`);
        }
        next();
};

module.exports.isAuthor = async(req,res,next)=>{
     let {id,reviewID}=req.params;
        let review = await Review.findById(reviewID);
        if(!review.author._id.equals(res.locals.currentUser._id)){
            req.flash("error","You are not the author of this review");
            return res.redirect(`/listing/${id}`);
        }
        next();
};


module.exports.validateListing=(req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
 if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
      throw new expressError(400, errMsg);
    }else{
 next();
    }
   };

   module.exports.validateReview=(req,res,next)=>{
       let {error} = reviewSchema.validate(req.body);
    if(error){
           let errMsg=error.details.map((el)=>el.message).join(",");
         throw new expressError(400, errMsg);
       }else{
    next();
       }
      
   };