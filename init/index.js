// const mongoose = require("mongoose");
// const data = require("./data.js");
// const Listing = require("../models/listing.js");
// const MONGO_URL = "mongodb://127.0.0.1:27017/HAVENLY";

// main()
//   .then(() => {
//     console.log("Connected to DB");
//   })
//   .catch((err) => {
//     console.error("Error connecting to MongoDB:", err);
//   });

// async function main() {
//   await mongoose.connect(MONGO_URL); // No need for useNewUrlParser and useUnifiedTopology
// }

// const initDB = async()=>{
// //clearing random data

// await Listing.deleteMany({});
// await Listing.insertMany(data.data);
// console.log("data was initialized");

// }
// initDB();
const mongoose = require("mongoose");
const data = require("./data.js");
const Listing = require("../models/listing.js"); // Ensure the path to your model is correct
const MONGO_URL = "mongodb://127.0.0.1:27017/HAVENLY";

// Main function to connect to MongoDB
async function main() {
  try {
    await mongoose.connect(MONGO_URL); // Connect to MongoDB
    console.log("Connected to DB");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
}

// Initialize the database
const initDB = async () => {
  try {
    // Clear existing data
    await Listing.deleteMany({});
    await Listing.insertMany(data.data); // Ensure data.data is structured correctly
    console.log("Data was initialized");
  } catch (err) {
    console.error("Error initializing the database:", err);
  }
};

// Run the main function to connect and initialize the database
main()
  .then(initDB) // Call initDB only after successful DB connection
  .catch(err => {
    console.error("Error during initialization:", err);
  });
