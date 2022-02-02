const express = require("express");
const router = express.Router();
const questions = require("../controllers/questions");

router.get("/fetchQuestions/:page", questions.fetchQuestions);

module.exports = router;
