const mongoose = require("mongoose");

const balanceSchema = new mongoose.Schema({
  username: String,
  value: Number,
});
const historySchema = {
  username: String,
  formattedDate: Date,
  formattedTime: String,
  type: String,
  amount: Number,
};

const Balance = mongoose.model("Balance", balanceSchema);
const History = mongoose.model("History", historySchema);

module.exports = { Balance, History };
