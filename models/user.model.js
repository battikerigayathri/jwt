


// Define a user schema and model
const mongoose = require(`mongoose`);
const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});
const User = mongoose.model("User", UserSchema);