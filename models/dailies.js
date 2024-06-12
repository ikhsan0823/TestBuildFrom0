const mongoose = require("mongoose");

const dailySchema = {
  username: String,
  title: String,
  description: String,
  date: Date,
  time: String,
  uniqueId: String,
  uploadPhoto: {
    type: Boolean,
    default: false
  },
  complete: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date,
    default: null,
  }
};

dailySchema.index({ completedAt: 1 }, { expireAfterSeconds: 86400 });

const Daily = mongoose.model("Daily", dailySchema);

module.exports = { Daily };
