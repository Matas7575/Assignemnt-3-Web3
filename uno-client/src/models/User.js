const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Define the User schema with username and password fields
const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true }, // Username must be unique and is required
  password: { type: String, required: true }, // Password is required
});

// Pre-save hook to hash the password before saving the user document
UserSchema.pre("save", async function (next) {
  // If the password is not modified, move to the next middleware
  if (!this.isModified("password")) return next();
  // Hash the password with a salt factor of 10
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Export the User model
module.exports = mongoose.model("User", UserSchema);