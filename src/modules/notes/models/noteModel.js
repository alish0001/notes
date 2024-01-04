const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notesSchema = new Schema({
  userEmail: String,
  isDeleted: Boolean,
  content: {
    type: String,
    index: "text",
  },
  createdAt: Date,
  updatedAt: Date,
  allowedUsers: [String],
});

const Notes = mongoose.model("notes", notesSchema);

module.exports = Notes;
