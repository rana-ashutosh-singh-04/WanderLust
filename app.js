if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");

const dbuRL= process.env.ATLASDB_URL

const userRouter = require("./routes/user.js");
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const { error } = require("console");

main()
.then(()=>{
    console.log("connected to DB")
})
.catch((err)=>{
    console.log(err)
})

async function main() {
    await mongoose.connect(dbuRL)
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate)
app.use(express.static(path.join(__dirname,"/public")))

const store = MongoStore.create({
    mongoUrl: dbuRL,
    crypto:{
        secret: process.env.secret
    },
    touchAfter:24 * 36000,
})

store.on("error",()=>{
    console.log("ERROR in MONGO SESSSION STORE", err)
})

const sessionOptions = {
    store,
    secret : process.env.secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 *60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly:true,
    },
}


// app.get("/",(req,res)=>{
//     res.send("Hi, I am root")
// })

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// app.get("/demouser", async(req,res)=>{
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "delta-student",
//     })

//     let registeredUser = await User.register(fakeUser, "helloworld");
//     res.send(registeredUser);
// })

app.use("/listings", listingsRouter)
app.use("/listings/:id/reviews", reviewsRouter)
app.use("/",userRouter);


app.all("",(req,res,next)=>{
    next(new ExpressError(404, "page not found!"))
})

app.use((err,req,res,next)=>{
    
    let {statusCode=500,message="Internal server error"} = err;
    // res.status(statusCode).send(message);
    console.error(err.stack);
   res.render("error.ejs",{message})
});

app.listen(8080,()=>{
    console.log("server to the port 8080")
})
