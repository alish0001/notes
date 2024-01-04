const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  userEmail: String,
  password: String,
  createdAt: Date,
});

const Users = mongoose.model("users", userSchema);

module.exports = Users;
