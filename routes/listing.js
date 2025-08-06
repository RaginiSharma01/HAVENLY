const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing");
const flash = require("connect-flash");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listing.js");

//index route

router.get("/", 
  wrapAsync(listingController.index));

//new route

router.get("/new", isLoggedIn,(req, res) => {
res.render("new");
});
  

//show route 
router.get("/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;

  const listing = await Listing.findById(id).populate("reviews").populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested does not exist");
    return res.redirect("/listings"); 
  }
  
  res.render("show.ejs", { listing }); // Ensure rendering if listing exists
}));
;


//Create route
router.post("/", isLoggedIn,validateListing,
    wrapAsync(async (req, res,next) => {   
      const newListing = new Listing(req.body.listing);  // No nested structure
      newListing.owner=req.user._id;
      await newListing.save();
      req.flash("success" , "New listing created!");
      res.redirect("/listings");
    
    })
  );
  
  //edit route
  router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    
    if (!listing) {
      req.flash("error", "Listing not found.");
      return res.redirect("/listings");
    }
  
    res.render("edit", { listing });
  }));
  
  
  
  
  //Update route
  router.put("/:id", isLoggedIn,isOwner,validateListing,
    wrapAsync(async (req, res) => {
       let { id } = req.params;
       await Listing.findByIdAndUpdate(id, { ...req.body.listing });
       req.flash("success" , "the listing updated!");
       res.redirect(`/listings/${id}`);
 
 }));
 
  
  // delete route
  
  router.delete("/:id" , isLoggedIn,isOwner,wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id) ;
    console.log (deletedListing)
    req.flash("success" , "the listing deleted!");
    res.redirect("/listings");
  }));

  module.exports = router;
  