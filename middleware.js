const Listing = require("./models/listing");
const ExpressError = require("./utils/expressError.js");
const { listingSchema,reviewSchema} = require("./schema.js");
const review = require("./models/review.js");


module.exports.isLoggedIn = (req, res, next) => {
  console.log(req.path, "..", req.originalUrl);

  if (!req.isAuthenticated()) {
    req.flash("error", "You must be logged in to create a listing.");
    return res.redirect("/login");
  }

  res.locals.currUser = req.user; // Ensure current user is set before next()
  next();
};

module.exports.isOwner = async (req, res, next) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
      req.flash("error", "Listing not found.");
      return res.redirect("/listings");
    }

    if (!req.user || !req.user._id) {
      req.flash("error", "User not authenticated.");
      return res.redirect("/login");
    }

    // Ensure listing.owner is an ObjectId before calling .equals()
    if (!listing.owner.equals(req.user._id)) {
      req.flash("error", "You don't have permission to edit this listing.");
      return res.redirect(`/listings/${id}`);
    }

    next();
  } catch (error) {
    console.error("Error in isOwner middleware:", error);
    req.flash("error", "Something went wrong.");
    return res.redirect("/listings");
  }
};
module.exports.validateListing = (req,res,next)=>{
  let {error} = listingSchema.validate(req.body);
  console.log(error);
  if(error){
    let errMsg = error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400 , errMsg)
  }else{
    next();
  }
};

//validate
module.exports.validateReview = (req,res,next)=>{
  let {error} = reviewSchema.validate(req.body);
  console.log(error);
  if(error){
    let errMsg = error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400 , errMsg)
  }else{
    next();
  }
};


// review author

module.exports.isReviewAuthor = async (req, res, next) => {
  try {
    const {id, reviewId } = req.params;
    const review = await review.findById(reviewId);

    // Ensure listing.owner is an ObjectId before calling .equals()
    if (!review.author.equals(review.locals.currUser._id_id)) {
      req.flash("error", "You don't have permission to delete this .");
      return res.redirect(`/listings/${id}`);
    }

    next();
  } catch (error) {
    console.error("Error in isOwner middleware:", error);
    req.flash("error", "Something went wrong.");
    return res.redirect("/listings");
  }
};
