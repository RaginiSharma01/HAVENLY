const express = require("express");
const app = express();
const mongoose = require("mongoose");
const MONGO_URL = "mongodb://127.0.0.1:27017/HAVENLY";
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejs_mate = require("ejs-mate");



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


//index route

app.get("/listings", async(req,res)=>{
  const allListings = await Listing.find({});
  res.render ("index.ejs" , {allListings});
});

//new route

app.get ("/listings/new" , (req , res)=>{
  res.render("new" );
  });
    

 //show route 
 app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  try {
    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).send("Listing not found");
    }
    res.render("show.ejs", { listing });
  } catch (err) {
    console.error("Error finding listing:", err);
    res.status(500).send("Error retrieving listing");
  }
});

//Create route
app.post("/listings", async (req, res) => {
  try {
      
    const newListing = new Listing(req.body.listing);  // No nested structure

    await newListing.save();
    res.redirect("/listings");
  } catch (error) {
    console.error("Error creating the listing:", error);
    res.status(500).send("Error creating the listing. Please try again.");
  }
});

//edit route
app.get("/listings/:id/edit", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send("Invalid ID format");
  }

  try {
    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).send("Listing not found");
    }
    res.render("edit", { listing });
  } catch (err) {
    console.error("Error finding listing:", err);
    res.status(500).send("Error retrieving listing");
  }
});

//Update
app.put("/listings/:id", async (req, res) => {
  try {
      let { id } = req.params;
      await Listing.findByIdAndUpdate(id, { ...req.body.listing });
      res.redirect(`/listings/${id}`);
  } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
  }
});



// delete route

app.delete("/listings/:id" ,async (req,res)=>{
  let {id} = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id) ;
  console.log (deletedListing)
  res.redirect("/listings");
});


 app.listen(8080 , () =>{
  console.log("server is listenging to port 8080")
 });