const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const Schema = mongoose.Schema;

// Create a user schema
const userSchema = new Schema({
  username: {
    type: String,
    required: true, // Ensure the username is required
  },
  email: {
    type: String,
    required: true, // Ensure email is required
  },
});

// Add passport-local-mongoose plugin to the schema
userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

module.exports = User;
