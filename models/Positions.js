const mongoose = require("mongoose");

const positionSchema = mongoose.Schema({
  _id: false,
  rankId: {
    type: String,
  },
  rankName: {
    type: String,
  },
});

module.exports = Position = mongoose.model("position", positionSchema);
