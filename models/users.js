const mongoose = require("mongoose");

const usersSchema = {
  username: String,
  email: String,
  password: String,
  name: {
    type: String,
    default: "",
  },
  gender: {
    type: String,
    default: "",
  },
  phoneNum: {
    type: String,
    default: "-",
  },
  birth: {
    type: String,
    default: "-",
  },
  resetToken: String,
  resetTokenExpiry: Date,
};

const Users = mongoose.model("Users", usersSchema);
module.exports = { Users };
