const mongoose = require("mongoose");

const subSectionSchema = mongoose.Schema({
  subsId: {
    type: Number,
  },
  name: {
    type: String,
  },
  subParent: {
    type: Number,
  },
  subLink: {
    type: String,
  },
  sited: {
    type: String,
  },
  observation: {
    type: String,
  },
  clouserDate: {
    type: String,
  },
  comments: {
    type: String,
  },
  risk: {
    type: String,
  },
  status: {
    type: String,
  },
  note: {
    type: String,
  },
  attachmentLink: {
    type: String,
  },
  ranks: {
    type: String,
  },
  shipType: {
    type: String,
  },
  evidence: {
    type: String,
  },
});

module.exports = SubSection = mongoose.model("subSection", subSectionSchema);
