const mongoose = require("mongoose");

const questionSchema = mongoose.Schema({
  suffix: {
    type: String,
  },
  qId: {
    type: Number,
  },
  qText: {
    type: String,
  },
  ansType: {
    type: String,
  },
  link: {
    type: String,
  },
  description: {
    type: String,
  },
  rank: {
    type: String,
  },
  shipType: {
    type: String,
  },
  vIq: {
    type: String,
  },
  qParent: {
    type: String,
  },
});

module.exports = Question = mongoose.model("question", questionSchema);
