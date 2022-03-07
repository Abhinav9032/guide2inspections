const mongoose = require("mongoose");

const positionSchema = mongoose.Schema({
  rankId: {
    type: Number,
  },
  rankName: {
    type: String,
  },
});

module.exports = Position = mongoose.model("position", positionSchema);
