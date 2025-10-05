const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing");
const flash = require("connect-flash");
const multer = require('multer');
const { storage } = require("../cloudConfig.js");
const uploads = multer({ storage });
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listing.js");

// Add Mapbox geocoding
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

//index route
router.get("/", wrapAsync(listingController.index));

//new route
router.get("/new", isLoggedIn, (req, res) => {
  res.render("new");
});

//show route 
router.get("/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;

  const listing = await Listing.findById(id)
    .populate("reviews")
    .populate("owner");
    
  if (!listing) {
    req.flash("error", "Listing you requested does not exist");
    return res.redirect("/listings"); 
  }
  
  res.render("show.ejs", { listing });
}));

//Create route with geocoding
router.post(
  "/",
  isLoggedIn,
  uploads.single("image"),   
  validateListing,
  wrapAsync(async (req, res) => {
    // Geocode the location
    let response = await geocodingClient
      .forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
      .send();

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;

    // Add geometry from geocoding
    if (response.body.features.length > 0) {
      newListing.geometry = response.body.features[0].geometry;
    }

    // Handle image upload
    if (req.file) {
      newListing.image = {
        url: req.file.path,
        filename: req.file.filename
      };
    }

    await newListing.save();
    req.flash("success", "New listing created!");
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

//Update route with geocoding
router.put("/:id", 
  isLoggedIn,
  isOwner,
  uploads.single("image"),
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    
    // Geocode the new location
    let response = await geocodingClient
      .forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
      .send();

    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    
    // Update geometry
    if (response.body.features.length > 0) {
      listing.geometry = response.body.features[0].geometry;
    }

    // Handle image update
    if (req.file) {
      listing.image = {
        url: req.file.path,
        filename: req.file.filename
      };
    }

    await listing.save();
    req.flash("success", "The listing updated!");
    res.redirect(`/listings/${id}`);
  })
);

// delete route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "The listing deleted!");
  res.redirect("/listings");
}));

module.exports = router;