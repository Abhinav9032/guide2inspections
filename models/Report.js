const mongoose = require("mongoose");

const reportSchema = mongoose.Schema({
  qId: {
    type: Number,
  },
  userId: {
    type: Number,
  },
  answerId: {
    type: String,
  },
  answer: {
    type: String,
  },
  comment: {
    type: String,
  },
  imageLink: {
    type: String,
  },
});

module.exports = Report = mongoose.model("report", reportSchema);
