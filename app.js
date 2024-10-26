const express = require("express");
const app = express();
const mongoose = require("mongoose");
const MONGO_URL = "mongodb://127.0.0.1:27017/HAVENLY";
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejs_mate = require("ejs-mate");
const price = parseFloat(Listing.price);
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/expressError.js");
const { listingSchema} = require("./schema.js");


console.log("Connecting to MongoDB with URL:", MONGO_URL); // Added for debugging

main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

async function main() {
  await mongoose.connect(MONGO_URL); // No need for useNewUrlParser and useUnifiedTopology
}

app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname,"views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs" , ejs_mate);
app.use(express.static(path.join(__dirname,"/public")));
app.use(express.static('public'));


app.get("/", (req, res) => {
  res.send("Hello, I am root");
});

const validateListing = (req,res,next)=>{
  let {error} = listingSchema.validate(req.body);
  console.log(error);
  if(error){
    let errMsg = error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400 , errMsg)
  }else{
    next();
  }
}


//index route

app.get("/listings", wrapAsync(async (req, res) => {

      const allListings = await Listing.find({});
     // console.log(allListings); // Debugging: check the structure of your listings
      res.render("index.ejs", { allListings });
}));

//new route

app.get("/listings/new", (req, res) => {
  res.render("new");
});
    

 //show route 
 app.get("/listings/:id",wrapAsync( async (req, res) => {
  let { id } = req.params;
 
    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).send("Listing not found");
    }
    res.render("show.ejs", { listing });
}));

//Create route
app.post("/listings", validateListing,
  wrapAsync(async (req, res,next) => {   
    const newListing = new Listing(req.body.listing);  // No nested structure
    await newListing.save();
    res.redirect("/listings");
  
  })
);

//edit route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("edit", { listing });
}));



//Update route
app.put("/listings/:id", validateListing,
   wrapAsync(async (req, res) => {
      let { id } = req.params;
      await Listing.findByIdAndUpdate(id, { ...req.body.listing });
      res.redirect(`/listings/${id}`);

}));


// delete route

app.delete("/listings/:id" , wrapAsync(async (req,res)=>{
  let {id} = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id) ;
  console.log (deletedListing)
  res.redirect("/listings");
}));



app.all('*', (req, res, next) => {
  next(new ExpressError(404, "Page not found!"));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error.ejs", { err });
});

 app.listen(8080 , () =>{
  console.log("server is listenging to port 8080")
 });