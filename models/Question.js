const mongoose = require("mongoose");

const questionSchema = mongoose.Schema({
  questionText: {
    type: String,
  },
  section: {
    type: String,
  },
  sub_section: {
    type: String,
  },
});

module.exports = Question = mongoose.model("question", questionSchema);
