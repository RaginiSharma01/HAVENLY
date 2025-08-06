const experss = require("express");
const router = experss.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing");
const{validateReview, isLoggedIn} = require("../middleware.js")
//validate 


//Reviews
//post routes

router.post("/",
  isLoggedIn,
   validateReview, 
   wrapAsync(async (req, res) => {
    
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    newReview.autor=req.user._id;
    console.log(newReview)
    await newReview.save();
    await listing.save();
    req.flash("success" , "New review created!");
    res.redirect(`/listings/${listing._id}`);
  }));
  
  //delete review route
  router.delete("/:reviewId" ,
    isLoggedIn
    ,wrapAsync(async(req,res)=>{
    let{id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success" , "review deleted!");
    res.redirect(`/listings/${id}`);
  
  })
  );

  module.exports= router;
  