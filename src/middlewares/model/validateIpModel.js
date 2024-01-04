const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const validateIpModel = new Schema({
  hitCount: Number,
  isBlocked: Boolean,
  createdTime: Date,
  ipAddress: String,
});

const IpModel = mongoose.model("validateIp", validateIpModel);
module.exports = IpModel;
