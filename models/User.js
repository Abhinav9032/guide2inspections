const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  position: {
    type: String,
  },
  shipType: {
    type: String,
  },
});

module.exports = User = mongoose.model("user", userSchema);
