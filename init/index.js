
const mongoose = require("mongoose");
const data = require("./data.js");
const Listing = require("../models/listing.js"); // Ensure the path to your model is correct
const MONGO_URL = "mongodb://127.0.0.1:27017/HAVENLY";

// Main function to connect to MongoDB
async function main() {
  await mongoose.connect(MONGO_URL); 
}

// Initialize the database
const initDB = async () => {
  await Listing.deleteMany({});
  initData =data
  initData.data = initData.data.map((obj)=>({
  ...obj,
  owner:'6707a771c662ab05771b52bb',
}));
await Listing.insertMany(initData.data);
console.log("data was initialized");
};
initDB();