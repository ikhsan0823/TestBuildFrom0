const mongoose = require("mongoose");

const dailySchema = {
  username: String,
  title: String,
  description: String,
  date: Date,
  uniqueId: String,
  nameday: String,
};

const Daily = mongoose.model("Daily", dailySchema);

module.exports = { Daily };
