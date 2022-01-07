const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AWS = require("aws-sdk");
const { getSectionNameAndSeq } = require("../actions/roles");
// const { getShipId, getPositionId } = require("../actions/postion&ship");
require("dotenv").config();

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

// desc: user's dashboard
exports.dashboard = async (req, res) => {
  const { userId } = req.body;
  const user = await User.findOne({ userId }).select("-password");
  if (!user)
    return res
      .status(404)
      .json({ responseCode: 404, responseMessage: "FAILED" });
  return res
    .status(200)
    .json({ responseCode: 200, responseMessage: "SUCCESS", acl: user.acl });
};

// desc: allocate or deallocate section
exports.allocateDeallocateSection = async (req, res) => {
  const { userId, sectionId, unlockDate } = req.body;
  const user = await User.findOne({ userId }).select("-password");

  user.acl.map((i) => {
    if (i.sectionId == sectionId) {
      i.isVisible = true;
      i.unlockDate = unlockDate;
    }
  });

  user.save((err, success) => {
    if (err) {
      console.log(err);
    }
    return res
      .status(200)
      .json({ responseCode: 200, responseMessage: "SUCCESS", user: success });
  });
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
