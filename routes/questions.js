const express = require("express");
const router = express.Router();
const questions = require("../controllers/questions");

router.get("/fetchQuestions/:page/:userId", questions.fetchQuestions);

router.post("/addOrBlockQuestions", questions.addOrBlockQuestions);

router.post("/addGlobalQuestion", questions.addGlobalQuestion);

router.get(
  "/numberOfQuestionsPerSection",
  questions.numberOfQuestionsPerSection
);

router.get(
  "/numberOfQuestionsPerSubSection",
  questions.numberOfQuestionsPerSubSection
);

router.delete("/deleteQuestionGlobal", questions.deleteQuestion);

router.post("/editQuestionGlobal", questions.editQuestion);

module.exports = router;
