const Review = require("../models/review.js");
const Listing = require("../models/listing.js")

module.exports.postReview = async(req,res)=>{
    let listing = await Listing.findById(req.params.id)
    let newReview = new Review(req.body.review);
 newReview.author = req.user._id;
    listing.reviews.push(newReview);
   await newReview.save();
    await listing.save();
       req.flash("success","Review addead successfully..")
    res.redirect(`/listing/${listing._id}`)
};

module.exports.destroyReview= async(req,res)=>{
    let {id,reviewID} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewID}});
  await Review.findByIdAndDelete(reviewID)
      req.flash("success","Review Deleted successfully..")
res.redirect(`/listing/${id}`);
}