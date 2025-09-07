const multer = require("multer");
const Listing = require("../models/listing");
const e = require("connect-flash");
const upload = multer({dest:'uploads/'})
const {mapping} = require('../mapping')

module.exports.index = async(req,res)=>{
   const allListings = await Listing.find({});
   res.render("./listings/index.ejs",{allListings})
}

module.exports.createListing =  async(req,res,next)=>{
        // error handelling - invalid data inserting through hopscotch
        // if(!req.body.listing){
        //     throw new ExpressError(400, "send valid data for listings")
        // }
    // let {title, description, image, price, country, location} = req.body;
    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(req.body.listing);
    newListing.owner =  req.user._id;
    newListing.image = {url, filename};
    await newListing.save();
    req.flash("success", "New Listing Created!")
    res.redirect("/listings");

    }

module.exports.showListing = async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",
        populate:{
            path:"author",
        }
    }).populate("owner");
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings")
    }
    res.render("listings/show.ejs",{listing,mapping})
}

module.exports.renderEditForm = async (req,res)=>{
    let {id} = req.params;  
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listing");
    }
    let originalImageURL = listing.image.url
    originalImageURL= originalImageURL.replace("/upload/", "/upload/w_500/")
    res.render("listings/edit.ejs",{listing,originalImageURL})
}
module.exports.updateListing = async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing} ,{new:true})
    console.log("file1:",req.file)
    if (req.file){
        console.log(req.file);
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url, filename};
    await listing.save();
    }
   
    req.flash("success", "Listing Updated")
    res.redirect(`/listings/${id}`)
}

module.exports.deleteListing = async (req,res)=>{
    let {id} = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!")
    res.redirect("/listings");
}