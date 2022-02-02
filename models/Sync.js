const mongoose = require("mongoose");

const syncSchema = mongoose.Schema({
  shipType: {
    type: Date,
  },
  positions: {
    type: Date,
  },
  sections: {
    type: Date,
  },
  questions: {
    type: Date,
  },
  subSections: {
    type: Date,
  },
});

module.exports = Sync = mongoose.model("sync", syncSchema);
