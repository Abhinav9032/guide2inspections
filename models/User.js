const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
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
  roles: [
    {
      role: {
        type: String,
      },
      isAllowed: {
        type: Boolean,
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now().toString(),
  },
});

module.exports = User = mongoose.model("user", userSchema);
