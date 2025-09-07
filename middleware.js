const Listing = require("./models/listing.js");
const review = require("./models/review.js");
const reviewSchema = require("./models/review.js");
module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","you must be logged in to create new listing");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next()
}

module.exports.isOwner = async(req,res,next)=>{
    let {id} = req.params;
     let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error", " you don't have permission to edit");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errorMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(404,errorMsg)
    }else{
        next();
    }
}

module.exports.isReviewAuthor = async(req,res,next)=>{
    let {reviewId, id} = req.params;
     let review = await reviewSchema.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error", " you are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}