const express = require("express"); // Fixed typo
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const User = require("../models/user.js");
const passport = require("passport");

// Signup Routes
router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

router.post("/signup", wrapAsync(async (req, res) => {
    
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password); 
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success", "Welcome to HAVENLY!");
            res.redirect("/listings");
        });
       
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}));

// Login Routes
router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});

router.post(
    "/login",
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
    }),
    (req, res) => {
        req.flash("success", "Welcome to HAVENLY!");
        let redirectUrl = res.locals.redirectUrl||"/listings";
        res.redirect(redirectUrl);
    }
);
router.get("/logout" , (req,res)=>{
   req.logout((err)=>{
    if(err){
        return next(err);
    }
    req.flash("success" , "you are logged out!");
    res.redirect("/listings");
   }) 
})

module.exports = router;
