const express = require("express");
const Question = require("../models/Question");
const router = express.Router();
const questions = require("../controllers/questions");

// @get questions from Google Sheet
router.get("/get-questions", questions.getQuestions);

router.post("/add-question", async (req, res) => {
  const numberOfQuestions = await Question.find({});

  const { note, evidence, questionText, section, subSection } = req.body;

  let ranksAllowed = [
    {
      rankType: "Master",
    },
    {
      rankType: "Auditor",
    },
    {
      rankType: "Chief Engineer",
    },
  ];

  let question = new Question({
    questionId: numberOfQuestions.length + 1,
    ranksAllowed,
    note,
    evidence,
    questionText,
    section,
    subSection,
  });

  question.save((err, result) => {
    if (err) {
      console.log(err);
    }

    return res.status(200).json(result);
  });
});

module.exports = router;
