const mongoose = require("mongoose");

const positionSchema = mongoose.Schema({
  positionId: {
    type: String,
  },
  positionName: {
    type: String,
  },
});

module.exports = Position = mongoose.model("position", positionSchema);
