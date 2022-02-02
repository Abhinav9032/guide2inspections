const Question = require("../models/Question");
require("dotenv").config();

// desc: fetch 1000 question per page from database
exports.fetchQuestions = async (req, res) => {
  const { page = 1 } = req.params;
  const limit = 1000;
  const questions = await Question.find({})
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ _id: 1 });

  res.status(200).json({ questions });
};
