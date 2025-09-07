const User = require("../models/user.js")
module.exports.userSignup = async(req,res)=>{
    try { 
        let {username, email, password} = req.body;
    const newUser = new User ({email,username});
    const registeredUser = await User.register(newUser,password);
    console.log(registeredUser);
    req.login(registeredUser,(err)=>{
        if(err){
            return next(err);
        }
    req.flash("success", "welcome to WanderLust!");
    res.redirect("/listings");   
    }) 
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup")
    }
   
}

module.exports.userLogin = async(req,res)=>{
    req.flash("success","Welcome back to Wonderlust ! You are logged in !")
    let redirectUrl = res.locals.redirectUrl || "/listings" ;
    res.redirect(redirectUrl);
  };

  module.exports.userLogout = (req,res)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        req.flash("success", "you are logged out!");
        res.redirect("/listings")
    })
}