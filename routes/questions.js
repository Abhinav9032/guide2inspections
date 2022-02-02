const express = require("express");
const router = express.Router();
const questions = require("../controllers/questions");

router.get("/fetchQuestions/:page", questions.fetchQuestions);

router.post("/addOrBlockQuestions", questions.addOrBlockQuestions);

router.post("/addGlobalQuestion", questions.addGlobalQuestion);

module.exports = router;
