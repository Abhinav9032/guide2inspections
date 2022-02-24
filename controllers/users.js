const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AWS = require("aws-sdk");
const { getSectionNameAndSeq } = require("../actions/roles");
const nodemailer = require("nodemailer");
const Question = require("../models/Question");
const { bindSectionsSubSection } = require("./subSections");
const SubSections = require("../models/SubSections");
// const { getShipId, getPositionId } = require("../actions/postion&ship");
require("dotenv").config();
// const {
//   numberOfQuestionsPerSection,
//   numberOfQuestionsPerSubSection,
// } = require("../controllers/questions");

exports.register = async (req, res) => {
  const { name, email, password, position, shipType, createdDate } = req.body;

  const is_already_registered = await User.findOne({ email });

  const numberOfUser = (await User.find({})).length;

  const currentInspection = {
    shipType,
    shipName: "none",
  };

  if (is_already_registered) {
    return res.json({
      responseCode: 403,
      responseMessage: "User already registered",
    });
  }

  let hashedPassword;

  const salt = await bcrypt.genSalt(10);
  hashedPassword = await bcrypt.hash(password, salt);

  let acl = [];
  for (let i = 1; i <= 16; i++) {
    if (i == 4) {
      acl.push({
        sectionId: i,
        sectionName: getSectionNameAndSeq(i).sectionName,
        sectionSequence: getSectionNameAndSeq(i).sectionSequence,
        isVisible: true,
      });
    } else {
      acl.push({
        sectionId: i,
        sectionName: getSectionNameAndSeq(i).sectionName,
        sectionSequence: getSectionNameAndSeq(i).sectionSequence,
        isVisible: false,
      });
    }
  }

  let user = new User({
    userId: numberOfUser + 1,
    name,
    email,
    password: hashedPassword,
    position,
    shipType,
    profileImage: "none",
    acl,
    currentInspection,
    createdDate,
  });

  user.save(async (err, u) => {
    if (err) {
      console.log(err);
    }
    const payload = {
      user: {
        id: u.id,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SCERET, {
      expiresIn: 100000000000,
    });

    let createdUser = await User.findById({ _id: u.id }).select(
      "-password -_id -__v -profileImage -acl -currentInspection"
    );

    return res.status(200).send({
      responseCode: 200,
      responseMessage: "SUCCESS",
      user: createdUser,
      token,
    });
  });
};

// editRolesFields
exports.editRolesFields = async (req, res) => {
  const { email, role, isAllowed } = req.body;
  const user = await User.findOne({ email }).select("-password");

  user.roles.map((r) => {
    if (r.role === role) {
      r.isAllowed = isAllowed;
    }
  });
  user.save((err, success) => {
    if (err) {
      return res
        .status(400)
        .json({ responseCode: 400, responseMessage: "FAILED" });
    } else {
      return res
        .status(200)
        .json({ responseCode: 200, responseMessage: "SUCCESS" });
    }
  });
};

//get user
exports.getUser = (req, res) => {
  const { userId } = req.body;
  User.findOne({ userId })
    .select("-password -_id -__v")
    .exec((err, user) => {
      if (err) {
        console.log(err);
      }

      return res.status(200).json({
        responseCode: 200,
        responseMessage: "SUCCESS",
        userDetails: user,
      });
    });
};

// aws s3 instance
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SCERET_ACCESS_KEY,
});

// desc: update user image
exports.updateUserImage = async (req, res) => {
  const imageFileName = req.file.originalname.split(".");
  const fileExtension = imageFileName[imageFileName.length - 1];

  const user = await User.findOne({ userId: req.body.userId });

  const s3Config = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: Date.now() + "." + fileExtension,
    Body: req.file.buffer,
  };

  s3.upload(s3Config, async (err, imageUrl) => {
    if (err) {
      console.log(err);
    }

    user.profileImage = imageUrl.Location;
    user.save((error, success) => {
      if (error) {
        console.log(error);
      }

      return res
        .status(200)
        .json({ userId: success.userId, image: success.profileImage });
    });
  });
};

const numberOfQuestionAsPerSectionId = async () => {
  const question = await Question.find({});
  let questionCount = 0;
  let questionCountDetails = [];
  let subSections = [];
  const sections = await bindSectionsSubSection();
  sections.map((s, index) => {
    if (index !== 0) {
      subSections = s.split(" ");
      subSections.map((ss) => {
        question.map((q) => {
          if (parseInt(ss) === parseInt(q.qParent)) {
            questionCount = questionCount + 1;
          }
        });
      });
      questionCountDetails.push({ sectionId: index, questionCount });
      questionCount = 0;
    }
  });
  return questionCountDetails;
};

// desc: user's dashboard
exports.dashboard = async (req, res) => {
  const { userId } = req.body;

  const user = await User.findOne({ userId }).select("-password");
  const { acl } = user;
  const fetchQuestions = await numberOfQuestionAsPerSectionId();
  const subSections = await SubSections.find({});

  // fetch the total number of question for a particular section
  const getQuestionCount = (sectionId) => {
    let questionCount = "";
    fetchQuestions.map((fq) => {
      if (fq.sectionId === sectionId) {
        questionCount = fq.questionCount;
      }
    });
    return questionCount;
  };

  // fetch the total number of sub-section for a particular section
  const getSubSectionsCount = (sectionId) => {
    let subSectionCount = 0;
    subSections.map((ss) => {
      if (ss.subParent === sectionId) {
        subSectionCount = subSectionCount + 1;
      }
    });
    return subSectionCount;
  };

  let modifiedAcl = [];
  acl.map(async (item) => {
    modifiedAcl.push({
      sectionId: item.sectionId,
      sectionName: item.sectionName,
      isVisible: item.isVisible,
      questionCount: getQuestionCount(item.sectionId),
      subSectionCount: getSubSectionsCount(item.sectionId),
    });
  });

  if (!user)
    return res
      .status(404)
      .json({ responseCode: 404, responseMessage: "FAILED" });
  return res.status(200).json({
    responseCode: 200,
    responseMessage: "SUCCESS",
    acl: modifiedAcl,
  });
};

// desc: allocate or deallocate section
exports.allocateDeallocateSection = async (req, res) => {
  const { userId, sectionId, lockDate } = req.body;
  const user = await User.findOne({ userId }).select("-password");

  user.acl.map((i) => {
    if (i.sectionId == sectionId) {
      i.isVisible = true;
      i.lockDate = lockDate;
    }
  });

  user.save((err, success) => {
    if (err) {
      console.log(err);
    }
    return res.status(200).json({
      responseCode: 200,
      responseMessage: "SUCCESS",
      acl: success.acl,
    });
  });
};

// desc: set a particular section as isVisible:true for matching date
exports.allocateSection = async (req, res) => {
  const { userId } = req.body;
  const user = await User.findOne({ userId });
  const { acl } = user;
  let date = new Date();
  date = date.toISOString().split("T")[0];
  acl.map((i) => {
    if (i.lockDate >= date) {
      i.isVisible = false;
    }
  });
  await user.save();

  res.status(200).json({ responseCode: 200, responseMessage: "SUCCESS", acl });
};

// desc: update user information
exports.updateUserProfile = async (req, res) => {
  const { position, shipType, userId } = req.body;
  const user = await User.findOne({ userId });
  if (position) user.position = position;
  if (shipType) {
    user.shipType = shipType;
    user.currentInspection.shipType = shipType;
  }
  const userSaved = await user.save();
  if (userSaved)
    res.status(200).json({ responseCode: 200, responseMessage: "SUCCESS" });
};

// desc: update current inspection
exports.updateCurrentInspection = async (req, res) => {
  const { userId, shipType, shipName } = req.body;
  const user = await User.findOne({ userId });
  if (shipType) {
    user.shipType = shipType;
    user.currentInspection.shipType = shipType;
  }
  if (shipName) user.currentInspection.shipName = shipName;
  const userSaved = await user.save();
  if (userSaved)
    res.status(200).json({ responseCode: 200, responseMessage: "SUCCESS" });
};

// desc: get current inspection
exports.getCurrentInspection = async (req, res) => {
  const { userId } = req.params;
  const user = await User.findOne({ userId });
  if (user) {
    res.status(200).json({
      responseCode: 200,
      responseMessage: "SUCCESS",
      currentInspection: user.currentInspection,
    });
  }
};

exports.grantDenyVideoAccess = async (req, res) => {
  const { userId, videoAccess } = req.body;
  const user = await User.findOne({ userId }).select("-password");
  user.videoAccess = videoAccess;
  await user.save();
};

exports.deleteUserQuestion = async (req, res) => {
  const { userId, qId } = req.body;
  const user = await User.findOne({ userId });
  let tempQuestion = user.questions;
  let formedQuestionsSet = [];
  tempQuestion.map((q, index) => {
    if (q.qId === qId) {
      delete tempQuestion[index];
    }
  });

  tempQuestion.map((tq) => {
    if (tq !== null) {
      formedQuestionsSet.push(tq);
    }
  });

  user.questions = formedQuestionsSet;
  await user.save();
  res.status(200).json({ responseCode: 200, responseMessage: "SUCCESS" });
};

exports.requestSectionUnlock = async (req, res) => {
  const { email, phoneNumber, sectionName, accessTill } = req.body;
  const user = await User.findOne({ email }).select("-password");
  const { name } = user;
  let date = new Date();

  let transporter = nodemailer.createTransport({
    service: "gmail",
    secure: false,
    auth: {
      user: `${process.env.EMAIL}`,
      pass: `${process.env.PASSWORD}`,
    },
  });

  var mailOptions = {
    from: process.env.EMAIL,
    to: "contact@navguidesolutions.com",
    subject: "Section unlock request",
    html: `<h2>Dear Admin,</h2><br/><p>New access request for the below user:</p><br/><p>Username: ${name}</p><p>Email: ${email}</p><p>Phone Number: ${phoneNumber}</p><p>Raised on: ${
      date.toISOString().split("T")[0]
    }</p><p>Section Name: ${sectionName}</p><p>Required access till: ${accessTill}</p>`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else res.status(200).json({ responseCode: 200, responseMessage: "SUCCESS" });
  });
};
