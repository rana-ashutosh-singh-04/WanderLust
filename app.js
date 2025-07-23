const express = require("express");
const app = express();
const ejs = require("ejs");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js")
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';
const wrapAsync = require("./utils/wrapAsync.js")
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js");

main()
.then(()=>{
    console.log("connected to DB")
})
.catch(()=>{
    console.log(err)
})

async function main() {
    await mongoose.connect(MONGO_URL)
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate)
app.use(express.static(path.join(__dirname,"/public")))

app.get("/",(req,res)=>{
    res.send("Hi, I am root")
})

const validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errrMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(404,errorMsg)
    }else{
        next();
    }
}
// index route
app.get("/listings", wrapAsync(async(req,res)=>{
   const allListings = await Listing.find({});
   res.render("./listings/index.ejs",{allListings})
}))

// create route : get
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs")
})

// create route : post
app.post("/listings", validateListing,
    wrapAsync( async(req,res,next)=>{
        // error handelling - invalid data inserting through hopscotch
        // if(!req.body.listing){
        //     throw new ExpressError(400, "send valid data for listings")
        // }
    // let {title, description, image, price, country, location} = req.body;
    
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
    })
)
// show route
app.get("/listings/:id", wrapAsync(async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs",{listing})
}))


// edit route
app.get("/listings/:id/edit", wrapAsync(async (req,res)=>{
    let {id} = req.params;  
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing})
}))

// update route
app.put("/listings/:id",validateListing, wrapAsync(async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing})
    res.redirect(`/listings/${id}`)
}))

// Destroy route
app.delete("/listings/:id",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}))


// app.get("/testListing",async (req,res)=>{
//     let sampleListing = new Listing({
//         title:"My new villa",
//         description:"By the beach",
//         price: 1200,
//         location: "Gaya ji ,Bihar",
//         country:"India",
//     });

//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful testing")
// })

app.all("",(req,res,next)=>{
    next(new ExpressError(404, "page not found!"))
})

app.use((err,req,res,next)=>{
    
    let {statusCode=500,message="Internal server error"} = err;
    // res.status(statusCode).send(message);
   res.render("error.ejs",{message})
});

app.listen(8080,()=>{
    console.log("server to the port 8080")
})