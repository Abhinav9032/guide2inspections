const Question = require("../models/Question");
const User = require("../models/User");
const sync = require("../controllers/sync");
require("dotenv").config();

const removeBlockedQuestions = (questions, blockedQuestions) => {
  let formedSet = [];

  blockedQuestions.map((bq) => {
    questions.map((q, i) => {
      if (bq.qId === q.qId) {
        delete questions[i];
      }
    });
  });

  questions.map((q) => {
    if (q !== null) formedSet.push(q);
  });

  return formedSet;
};

// desc: fetch 1000 question per page from database
exports.fetchQuestions = async (req, res) => {
  const { page = 1, userId } = req.params;
  const limit = 1000;
  const user = await User.findOne({ userId }).select("-password");
  const questionsFromDB = await Question.find({})
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ _id: 1 });
  const { blockedQuestions, questions } = user;

  let ispresent = false;

  let formedQuestions = [];

  questionsFromDB.map((q) => {
    ispresent = false; //check if there is question to be replaced

    questions.map((uq) => {
      if (q.qId === uq.qId) {
        formedQuestions.push(uq);
        ispresent = true; // confirms there is a question for replacement
      }
    });

    if (ispresent === false) formedQuestions.push(q);
  });

  let formedSet = removeBlockedQuestions(formedQuestions, blockedQuestions);

  res.status(200).json({
    questions: formedSet,
  });
};

//desc: add or block user specific questions
exports.addOrBlockQuestions = async (req, res) => {
  const { userId, type, addedQuestions, blockedQuestions } = req.body;
  const user = await User.findOne({ userId });

  if (type === 1) {
    // add questions
    addedQuestions.forEach((q) => {
      user.questions.push(q);
    });
  }

  if (type === 0) {
    user.blockedQuestions = blockedQuestions;
  }
  sync.syncUpdates("questions");
  await user.save();
};

//desc: add question for mass users
exports.addGlobalQuestion = async (req, res) => {
  const fetchedQuestions = await Question.find({}).sort({ _id: -1 });

  const {
    suffix,
    qText,
    ansType,
    link,
    rank,
    description,
    shipType,
    vIq,
    qParent,
  } = req.body;

  let question = Question({
    suffix,
    qId: fetchedQuestions[0].qId + 1,
    qText,
    ansType,
    link,
    rank,
    description,
    shipType,
    vIq,
    qParent,
  });
  sync.syncUpdates("questions");
  await question.save();
  res.status(200).json({ responseCode: 200, responseMessage: "SUCCESS" });
};
