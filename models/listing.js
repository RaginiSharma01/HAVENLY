const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const review = require("./review");

const listingSchema = new Schema({
  title: String,
  description: String,
  image: {
    url: String,
    filename: String,
  },
  price: Number,
  location: String,
  country: String,
  reviews: [{
    type: Schema.Types.ObjectId,
    ref: "Review",
  }],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  geometry: {
  type: {
    type: String,
    enum: ['Point'],
    required: false  // Changed to false temporarily
  },
  coordinates: {
    type: [Number],
    required: false  // Changed to false temporarily
  }
},

});


listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
