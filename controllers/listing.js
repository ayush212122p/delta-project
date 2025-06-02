const Listing = require("../models/listing");

module.exports.index = async (req,res)=>{
    const allListing=await Listing.find();
    res.render("./listings/index.ejs",{allListing});
};
module.exports.search = async (req,res)=>{
    let {country}=req.query;
    const allListing=await Listing.find({country:country});
    if(allListing.length===0){
        req.flash("error","No Listing Found");
        return res.redirect("/listing");
    }
    res.render("./listings/search.ejs",{allListing});
};

module.exports.renderNewForm = (req,res)=>{
    res.render("./listings/new.ejs");
};

module.exports.createListing = async (req,res)=>{
    let url = req.file.path;
    let filename = req.file.filename;
    console.log(url,"...",filename);
    
  let listing=req.body.listing;
 let newListing= new Listing(listing);
 newListing.owner=req.user._id;
 newListing.img = {url,filename};
    await newListing.save();
    console.log(newListing);
    req.flash("success","New Listing Added..")
    res.redirect("/listing");
};

module.exports.showListing = async (req,res)=>{
    let {id} = req.params;
    let  listing = await Listing.findById(id).populate({
        path:"reviews",
        populate:{
            path:"author",
        },

    }).populate("owner");
    if(!listing){
        req.flash("error","Listing Not Existed");
        res.redirect("/listing");
    }
    res.render("./listings/show.ejs",{listing})
};

module.exports.destroyListing = async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
        req.flash("success","Listing Deleted successfully..")
    res.redirect("/listing");
};

module.exports.renderEditform = async (req,res)=>{
let {id}=req.params;
let  listing = await Listing.findById(id);
if(!listing){
        req.flash("error","Listing Not Existed");
        res.redirect("/listing");
    }
    let originalUrl = listing.img.url;
originalUrl=originalUrl.replace("/upload" , "/upload/w_250");
res.render("./listings/edit.ejs",{listing,originalUrl})
};

module.exports.UpdateListing = async (req,res)=>{
    let {id}=req.params;
   let listing= await Listing.findByIdAndUpdate(id,{...req.body.listing});
   if(typeof req.file !=="undefined"){
  let url = req.file.path;
    let filename = req.file.filename;
    listing.img={url,filename};
  await listing.save();
   }
   req.flash("success","Updated successfully..")
    res.redirect(`/listing/${id}`)
}