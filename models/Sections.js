const mongoose = require("mongoose");

const sectionSchema = mongoose.Schema({
  sectionId: {
    type: Number,
  },
  sectionName: {
    type: String,
  },
  sectionThumbnail: {
    type: String,
  },
  // eligibleRank: [
  //   {
  //     _id: false,
  //     rankId: {
  //       type: Number,
  //     },
  //   },
  // ],
  eligibleRank: {
    type: String,
  },
  // eligibleShipType: [
  //   {
  //     _id: false,
  //     shipTypeId: {
  //       type: Number,
  //     },
  //   },
  // ],
  eligibleShipType: {
    type: String,
  },
  sequence: {
    type: Number,
  },
  note: {
    type: String,
  },
  lastUnlockDate: {
    type: Date,
  },
});

module.exports = Section = mongoose.model("section", sectionSchema);

