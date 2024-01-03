const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notesSchema = new Schema({
  userEmail: String,
  isDeleted: Boolean,
  content: String,
  createdAt: Date,
  updatedAt: Date,
});

const Notes = mongoose.model("notes", notesSchema);

module.exports = Notes;
