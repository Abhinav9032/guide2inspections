const mongoose = require("mongoose");

const shipSchema = mongoose.Schema({
  shipTypeId: {
    type: String,
  },
  shipTypeName: {
    type: String,
  },
});

module.exports = Ship = mongoose.model("ship", shipSchema);
