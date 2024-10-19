const mongoose = require("mongoose");
const data = require("./data.js");
const Listing = require("../models/listing.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/HAVENLY";

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

const initDB = async()=>{
//clearing random data

await Listing.deleteMany({});
await Listing.insertMany(data.data);
console.log("data was initialized");

}
initDB();