const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner} = require("../middleware.js");
const multer = require("multer");
const {storage} = require("../cloudconfig.js")
const upload = multer({storage})
const validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errorMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(404,errorMsg)
    }else{
        next();
    }
}  

 const listingController = require("../controllers/listing.js");

// index route 
router.route("/")
.get( wrapAsync(listingController.index))
 .post(isLoggedIn, validateListing,
     upload.single("listing[image]"),
    wrapAsync( listingController.createListing)
 )

// New route : get
router.get("/new",isLoggedIn,(req,res)=>{
    res.render("listings/new.ejs")
})

router.route("/:id")
.get( wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing, wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.deleteListing))

// edit route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm))


module.exports = router;