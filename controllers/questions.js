const Question = require("../models/Question");
const User = require("../models/User");
const sync = require("../controllers/sync");
const SubSections = require("../models/SubSections");
const { bindSectionsSubSection } = require("../controllers/subSections");
require("dotenv").config();

const removeBlockedQuestions = (questions, blockedQuestions) => {
  let formedSet = [];

  blockedQuestions.map((bq) => {
    questions.map((q, i) => {
      if (bq.qId == q.qId) {
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
      if (q.qId == uq.qId) {
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
    // block questions
    user.blockedQuestions = blockedQuestions;
  }
  sync.syncUpdates("questions");
  await user.save();
  res.status(200).json({ responseCode: 200, responseMessage: "SUCCESS" });
};

//desc: add question for mass users
exports.addGlobalQuestion = async (req, res) => {
  const fetchedQuestions = await Question.find({}).sort({ _id: -1 });
  let result = {};

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
  result = await question.save();
  res
    .status(200)
    .json({ responseCode: 200, responseMessage: "SUCCESS", result });
};

// desc: get question count per secttion
// exports.numberOfQuestionsPerSection = async () => {
//   const question = await Question.find({});
//   const sections = await bindSectionsSubSection();
//   let questionCount = 0;
//   let questionCountDetails = [];
//   let subSections = [];

//   sections.map((s, index) => {
//     if (index !== 0) {
//       subSections = s.split(" ");
//       subSections.map((ss) => {
//         question.map((q) => {
//           if (parseInt(ss) === parseInt(q.qParent)) {
//             questionCount = questionCount + 1;
//           }
//         });
//       });
//       questionCountDetails.push({ sectionId: index, questionCount });
//       questionCount = 0;
//     }
//   });
//   return questionCountDetails;
// };

// desc: get question count per subsecttion
// exports.numberOfQuestionsPerSubSection = async () => {
//   const question = await Question.find({});
//   const subSections = await SubSections.find({});
//   let questionCount = 0;
//   let questionCountDetails = [];
//   subSections.map((ss) => {
//     question.map((q) => {
//       if (ss.subsId === parseInt(q.qParent)) {
//         questionCount = questionCount + 1;
//       }
//     });
//     questionCountDetails.push({ subSectionId: ss.subsId, questionCount });
//     questionCount = 0;
//   });
//   return questionCountDetails;
// };

exports.deleteQuestion = async (req, res) => {
  const { qId } = req.body;
  try {
    await Question.findOneAndDelete({ qId });
    res.status(200).json({ responseCode: 200, responseMessage: "SUCCESS" });
  } catch (err) {
    console.log(err);
  }
};

exports.editQuestion = async (req, res) => {
  const { question } = req.body;
  let result = {};
  try {
    let targetQuestion = await Question.findOne({ qId: question.qId });
    targetQuestion.suffix = question.suffix;
    targetQuestion.qText = question.qText;
    targetQuestion.ansType = question.ansType;
    targetQuestion.description = question.description;
    targetQuestion.link = question.link;
    targetQuestion.rank = question.rank;
    targetQuestion.shipType = question.shipType;
    targetQuestion.vIq = question.vIq;
    targetQuestion.qParent = question.qParent;
    result = await targetQuestion.save();
  } catch (err) {
    console.log(err);
  }
  res
    .status(200)
    .json({ responseCode: 200, responseMessage: "SUCCESS", result });
};
