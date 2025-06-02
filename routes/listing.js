const express =require("express");
const router= express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const {isLoggedin,isOwner,validateListing}= require("../middleware.js")
const Listingcontroller=require("../controllers/listing.js");
const multer  = require('multer');
const {storage}= require("../cloudConfig.js");
const upload = multer({storage});


// it includes index and create routes
router.route("/")
.get(wrapAsync(Listingcontroller.index))
.post(upload.single("listing[img]"),validateListing,wrapAsync(Listingcontroller.createListing));

router.get("/new",isLoggedin,wrapAsync(Listingcontroller.renderNewForm));
router.get("/search",wrapAsync(Listingcontroller.search));
// it includes show, update and delete routes
router.route("/:id")
.get(wrapAsync(Listingcontroller.showListing))
.delete(isLoggedin,isOwner,wrapAsync(Listingcontroller.destroyListing))
.put(isLoggedin,isOwner,upload.single("listing[img]"),validateListing,wrapAsync(Listingcontroller.UpdateListing));


//Edit Route
router.get("/:id/edit",isLoggedin,isOwner,wrapAsync(Listingcontroller.renderEditform));




module.exports=router;