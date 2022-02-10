const mongoose = require("mongoose");

const syncSchema = mongoose.Schema({
  shipType: {
    type: String,
  },
  positions: {
    type: String,
  },
  sections: {
    type: String,
  },
  questions: {
    type: String,
  },
  subSections: {
    type: String,
  },
});

module.exports = Sync = mongoose.model("sync", syncSchema);
